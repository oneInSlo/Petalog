import { useEffect, useRef, type MouseEvent, type ReactNode, type SyntheticEvent } from "react";

export function Dialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!ref.current?.open) {
      ref.current?.showModal();
    }
  }, []);

  function handleCancel(event: SyntheticEvent) {
    event.preventDefault();
    onClose();
  }

  // The content fills the dialog, so only a click on the backdrop targets the element itself
  function handleClick(event: MouseEvent) {
    if (event.target === ref.current) {
      onClose();
    }
  }

  return (
    <dialog
      ref={ref}
      onCancel={handleCancel}
      onClick={handleClick}
      className="m-auto w-[calc(100%-2.5rem)] max-w-[520px] rounded-lg bg-card text-foreground shadow-dialog backdrop:bg-overlay"
    >
      <div className="flex flex-col gap-5 p-7">
        <h2 className="font-display text-[22px] font-bold">{title}</h2>
        {children}
      </div>
    </dialog>
  );
}
