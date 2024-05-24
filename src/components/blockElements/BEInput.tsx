import { APP_ENUMS } from '@/common/enums';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BE_TAGS } from '@/entities/blockElement/BEInterfaces';
import { useStore } from '@/stores/RootStore';
import React from 'react';

interface IBEInputProps {}

export const BEInput = (props: IBEInputProps) => {
  const {} = props;
  const store = useStore();
  const [text, setText] = React.useState('');
  const [selectedTag, setSelectedTagTag] = React.useState<BE_TAGS>(
    APP_ENUMS.BE_TAGS.TEXT
  );

  const handleSelectTag = (tag: BE_TAGS) => {
    setSelectedTagTag(tag);
  };

  const handleAddBE = () => {
    store.BEEditStore.createBE({
      tag: selectedTag,
      contents: { innerText: text },
    });

    setText('');
  };

  return (
    <div className="p-2 m-2 border-2 border-gray-700">
      <div className="flex">
        <BETagDropdown
          onSelectTag={handleSelectTag}
          selectedTag={selectedTag}
        />
        <div
          contentEditable
          suppressContentEditableWarning
          className="p-2 m-x-2 flex-1"
          data-placeholder="Click me and start typing!"
          onInput={(e) => setText(e.currentTarget.innerText)}
        >
          {text}
        </div>
        <Button variant="outline" onClick={handleAddBE}>
          Add
        </Button>
      </div>
    </div>
  );
};

interface IBETagDropdown {
  onSelectTag: (selectedTag: BE_TAGS) => void;
  selectedTag: BE_TAGS;
}

const BETagDropdown = (props: IBETagDropdown) => {
  const { onSelectTag, selectedTag } = props;

  const beTags = Object.values(APP_ENUMS.BE_TAGS).filter(
    (tag) => tag !== APP_ENUMS.BE_TAGS.ROOT
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <span className="first-letter:uppercase">
            {selectedTag.toLowerCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {beTags.map((tag) => {
          return (
            <DropdownMenuItem key={tag} onClick={() => onSelectTag(tag)}>
              <span className="first-letter:uppercase">
                {tag.toLowerCase()}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
