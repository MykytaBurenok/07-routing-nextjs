"use client";

import { useRouter } from "next/navigation";
import Modal from "../../../components/Modal/Modal";
import NotePreview from "../../../components/NotePreview/NotePreview";

export default function ModalPage() {
  const router = useRouter();

  return (
    <Modal onClose={() => router.back()}>
      <NotePreview />
    </Modal>
  );
}
