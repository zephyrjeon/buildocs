'use client';

import { BlockNoteEditor } from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import { BlockNoteView, useCreateBlockNote } from '@blocknote/react';
import '@blocknote/react/style.css';
import { useTheme } from 'next-themes';

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();

  const handleUpload = async (file: File) => {
    // const response = await edgestore.publicFiles.upload({
    //   file
    // });

    // return response.url;
    return '';
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    // editable,
    // initialContent: initialContent
    //   ? (JSON.parse(initialContent) as PartialBlock[])
    //   : undefined,
    // onEditorContentChange: (editor) => {
    //   onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    // },
    uploadFile: handleUpload,
  });

  // const editor = useCreateBlockNote();

  return (
    <div>
      {/* <BlockNoteView
        editor={editor}
        // theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      /> */}
    </div>
  );
};

export default Editor;
