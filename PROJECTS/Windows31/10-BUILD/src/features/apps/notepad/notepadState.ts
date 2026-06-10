export interface NotepadState {
  content: string;
}

export function clearNotepad(_current: NotepadState): NotepadState {
  return {
    content: '',
  };
}
