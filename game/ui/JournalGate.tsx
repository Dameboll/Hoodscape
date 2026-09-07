'use client';
import type {Save} from '../simulation/state';
import {StoryJournal as StoryJournalContent} from './StoryJournal';

export function StoryJournal({save}:{save:Save}){
 if(!save.discovered?.length)return <section className="story-journal"><div className="story-heading"><span>YOUR JOURNAL</span><h3>No entries yet</h3><p>Explore Saint Mercer, meet someone, or find a place worth remembering.</p></div></section>;
 return <StoryJournalContent save={save}/>;
}
