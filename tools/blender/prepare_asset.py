"""Normalize an FBX/GLB asset and export a web-ready GLB from Blender.

Run headlessly:
  blender --background --python tools/blender/prepare_asset.py -- input.fbx output.glb --kind character
"""
import argparse
import json
import math
import os
import sys
import bpy

def arguments():
    parser=argparse.ArgumentParser()
    parser.add_argument('input')
    parser.add_argument('output')
    parser.add_argument('--kind',choices=('character','vehicle','weapon'),required=True)
    parser.add_argument('--target',type=float)
    return parser.parse_args(sys.argv[sys.argv.index('--')+1:])

def reset_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

def import_asset(filename):
    extension=os.path.splitext(filename)[1].lower()
    if extension=='.fbx': bpy.ops.import_scene.fbx(filepath=filename,use_anim=True)
    elif extension in ('.glb','.gltf'): bpy.ops.import_scene.gltf(filepath=filename)
    else: raise ValueError(f'Unsupported asset type: {extension}')

def bounds(objects):
    points=[]
    for obj in objects:
        if obj.type=='MESH': points.extend(obj.matrix_world @ mathutils.Vector(corner) for corner in obj.bound_box)
    if not points: raise ValueError('Asset contains no mesh geometry')
    minimum=[min(point[i] for point in points) for i in range(3)]
    maximum=[max(point[i] for point in points) for i in range(3)]
    return minimum,maximum

def normalize(kind,target):
    roots=[obj for obj in bpy.context.scene.objects if obj.parent is None]
    minimum,maximum=bounds(bpy.context.scene.objects)
    size=[maximum[i]-minimum[i] for i in range(3)]
    length=size[1] if kind=='character' else max(size[0],size[2])
    scale=target/length
    for root in roots:
        root.scale=[axis*scale for axis in root.scale]
    bpy.context.view_layer.update()
    minimum,maximum=bounds(bpy.context.scene.objects)
    center=[(minimum[i]+maximum[i])/2 for i in range(3)]
    for root in roots:
        root.location.x-=center[0]
        root.location.y-=minimum[1]
        root.location.z-=center[2]
    for obj in bpy.context.scene.objects:
        if obj.type=='MESH':
            obj.data.validate(clean_customdata=False)
            for polygon in obj.data.polygons: polygon.use_smooth=True

def report(kind):
    meshes=[obj for obj in bpy.context.scene.objects if obj.type=='MESH']
    armatures=[obj for obj in bpy.context.scene.objects if obj.type=='ARMATURE']
    triangles=sum(sum(len(poly.vertices)-2 for poly in obj.data.polygons) for obj in meshes)
    return {'kind':kind,'meshes':len(meshes),'triangles':triangles,'armatures':len(armatures),'bones':sum(len(obj.data.bones) for obj in armatures),'actions':[action.name for action in bpy.data.actions]}

def main():
    args=arguments();target=args.target or {'character':1.82,'vehicle':4.6,'weapon':.9}[args.kind]
    reset_scene();import_asset(os.path.abspath(args.input));normalize(args.kind,target)
    os.makedirs(os.path.dirname(os.path.abspath(args.output)),exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=os.path.abspath(args.output),export_format='GLB',export_apply=True,export_animations=True,export_morph=True,export_skins=True,export_yup=True,export_image_format='AUTO')
    print('HOODSCAPE_ASSET_REPORT '+json.dumps(report(args.kind),sort_keys=True))

if __name__=='__main__':
    import mathutils
    main()
