"use client";

import Modal from "../../../../components/Modal/Modal";
import NotePreview from "../../../../components/NotePreview/NotePreview";
import { useRouter } from "next/navigation";

export default function ModalPage() {
  const router = useRouter();

  return (
    <Modal onClose={() => router.back()}>
      <NotePreview />
    </Modal>
  );
}
