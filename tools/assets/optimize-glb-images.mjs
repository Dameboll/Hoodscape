import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const [input,output,maxArg='512']=process.argv.slice(2);
if(!input||!output)throw new Error('Usage: node tools/assets/optimize-glb-images.mjs INPUT.glb OUTPUT.glb [MAX_SIZE]');
const maxSize=Number(maxArg);
if(!Number.isFinite(maxSize)||maxSize<64)throw new Error('MAX_SIZE must be at least 64');

const file=fs.readFileSync(input);
if(file.toString('ascii',0,4)!=='glTF'||file.readUInt32LE(4)!==2)throw new Error('Only binary glTF 2.0 files are supported');
let offset=12,json,bin;
while(offset<file.length){const length=file.readUInt32LE(offset),type=file.toString('ascii',offset+4,offset+8),chunk=file.subarray(offset+8,offset+8+length);if(type==='JSON')json=JSON.parse(chunk.toString('utf8').trim());if(type==='BIN\0')bin=chunk;offset+=8+length}
if(!json||!bin)throw new Error('GLB is missing JSON or BIN chunk');

const imageByView=new Map((json.images||[]).filter(image=>image.bufferView!==undefined).map(image=>[image.bufferView,image]));
const chunks=[];let byteOffset=0,before=0,after=0;
for(let index=0;index<json.bufferViews.length;index++){
 const view=json.bufferViews[index];let bytes=bin.subarray(view.byteOffset||0,(view.byteOffset||0)+view.byteLength);const image=imageByView.get(index);
 if(image){before+=bytes.length;const pipeline=sharp(bytes).resize({width:maxSize,height:maxSize,fit:'inside',withoutEnlargement:true});if(image.mimeType==='image/jpeg')bytes=await pipeline.jpeg({quality:78,mozjpeg:true}).toBuffer();else bytes=await pipeline.png({compressionLevel:9,palette:false}).toBuffer();after+=bytes.length}
 const padding=(4-byteOffset%4)%4;if(padding){chunks.push(Buffer.alloc(padding));byteOffset+=padding}view.byteOffset=byteOffset;view.byteLength=bytes.length;chunks.push(bytes);byteOffset+=bytes.length;
}
let nextBin=Buffer.concat(chunks);if(nextBin.length%4)nextBin=Buffer.concat([nextBin,Buffer.alloc(4-nextBin.length%4)]);json.buffers[0].byteLength=nextBin.length;
let jsonBytes=Buffer.from(JSON.stringify(json));if(jsonBytes.length%4)jsonBytes=Buffer.concat([jsonBytes,Buffer.alloc(4-jsonBytes.length%4,0x20)]);
const header=Buffer.alloc(12),jsonHeader=Buffer.alloc(8),binHeader=Buffer.alloc(8),total=12+8+jsonBytes.length+8+nextBin.length;
header.write('glTF');header.writeUInt32LE(2,4);header.writeUInt32LE(total,8);jsonHeader.writeUInt32LE(jsonBytes.length,0);jsonHeader.write('JSON',4);binHeader.writeUInt32LE(nextBin.length,0);binHeader.write('BIN\0',4);
fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,Buffer.concat([header,jsonHeader,jsonBytes,binHeader,nextBin]));
console.log(JSON.stringify({input,output,bytesBefore:file.length,bytesAfter:total,imageBytesBefore:before,imageBytesAfter:after}));
