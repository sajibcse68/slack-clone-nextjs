import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Quill, { Delta, Op, type QuillOptions } from 'quill';
import { PiTextAa } from 'react-icons/pi';
import { MdSend } from 'react-icons/md';
import { ImageIcon, Smile } from 'lucide-react';

import { cn } from '@/lib/utils';
import 'quill/dist/quill.snow.css';
import { Button } from './ui/button';
import { Hint } from './hint';
import { EmojiPopover } from './emoji-popover';

// constants
import { EDITOR_VARIANT } from '@/constants';

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  variant?: EDITOR_VARIANT;
  defaultValue?: Delta | Op[];
  placeholder?: string;
  disabled?: boolean;
  innerRef?: RefObject<Quill | null>;
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
}

const Editor = ({
  variant = EDITOR_VARIANT.CREATE,
  placeholder = 'Write something...',
  defaultValue,
  innerRef,
  disabled = false,
  onSubmit,
  // onCancel,
}: EditorProps) => {
  const [text, setText] = useState('');
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const disabledRef = useRef(disabled);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    // quillRef.current = innerRef?.current;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement('div')
    );

    const options: QuillOptions = {
      theme: 'snow',
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ['bold', 'italic', 'strike', 'underline'],
          ['link'],
          [{ list: 'ordered' }, { list: 'bullet' }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: 'Enter',
              handler: () => {
                // TODO: submit logic
                return;
              },
            },
            shift_enter: {
              key: 'Enter',
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection(true)?.index || 0, '\n');
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);
    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current || new Delta());
    setText(quill.getText());

    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);

      if (container) {
        container.innerHTML = '';
      }
      if (quillRef.current) {
        quillRef.current = null;
      }
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [innerRef]);

  const toggleToolbar = () => {
    setIsToolbarVisible((prev) => !prev);
    const toolbarElement = containerRef.current?.querySelector('.ql-toolbar');

    if (toolbarElement) {
      toolbarElement.classList.toggle('hidden');
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    const quill = quillRef.current;
    if (!quill) return;

    const cursorPosition = quill.getSelection(true)?.index || 0;

    quill.insertText(cursorPosition, emoji.native);
  };

  const isEmpty = text.replace(/<(.|\n)*?/g, '').trim().length === 0;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm bg-white">
        <div ref={containerRef} className="h-full ql-custom" />
        <div className="flex px-2 pb-2 z-[5]">
          <Hint
            label={isToolbarVisible ? 'Hide Formatting' : 'Show Formatting'}
          >
            <Button
              variant="ghost"
              disabled={disabled}
              size="iconSm"
              onClick={toggleToolbar}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <EmojiPopover onEmojiSelect={handleEmojiSelect}>
            <Button variant="ghost" disabled={disabled} size="iconSm">
              <Smile className="size-4" />
            </Button>
          </EmojiPopover>

          {variant === EDITOR_VARIANT.CREATE && (
            <Hint label="Image">
              <Button
                variant="ghost"
                disabled={disabled}
                size="iconSm"
                onClick={() => {}}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}

          {variant === EDITOR_VARIANT.UPDATE && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={() => {}}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                size="sm"
                disabled={disabled || isEmpty}
                onClick={() => {}}
              >
                Save
              </Button>
            </div>
          )}

          {variant === EDITOR_VARIANT.CREATE && (
            <Button
              className={cn(
                'ml-auto',
                isEmpty
                  ? 'bg-white hover:bg-white text-muted-foreground'
                  : 'bg-[#007a5a] hover:bg-[#007a5a]/80 text-white'
              )}
              size="iconSm"
              disabled={disabled || isEmpty}
              onClick={() => {}}
            >
              <MdSend className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {variant === EDITOR_VARIANT.CREATE && (
        <p
          className={cn(
            'p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition',
            !isEmpty && 'opacity-100'
          )}
        >
          <strong>Shift + Return</strong> &nbsp; to add a new line
        </p>
      )}
    </div>
  );
};

export default Editor;
