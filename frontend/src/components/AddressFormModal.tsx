import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { Address, AddressLabel } from "@/hooks/useAddresses";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Address, "id">) => void;
  editing?: Address | null;
}

const labels: AddressLabel[] = ["Дом", "Работа", "Другое"];

const AddressFormModal = ({ open, onClose, onSave, editing }: Props) => {
  const [label, setLabel] = useState<AddressLabel>("Дом");
  const [address, setAddress] = useState("");
  const [entrance, setEntrance] = useState("");
  const [floor, setFloor] = useState("");
  const [apartment, setApartment] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editing) {
      setLabel(editing.label);
      setAddress(editing.address);
      setEntrance(editing.entrance || "");
      setFloor(editing.floor || "");
      setApartment(editing.apartment || "");
      setComment(editing.comment || "");
    } else {
      setLabel("Дом");
      setAddress("");
      setEntrance("");
      setFloor("");
      setApartment("");
      setComment("");
    }
    setError("");
  }, [editing, open]);

  const handleSave = () => {
    if (!address.trim()) {
      setError("Укажите адрес");
      return;
    }
    onSave({
      label,
      address: address.trim(),
      entrance: entrance.trim() || undefined,
      floor: floor.trim() || undefined,
      apartment: apartment.trim() || undefined,
      comment: comment.trim() || undefined,
    });
    onClose();
  };

  const inputClass = "w-full bg-secondary text-foreground rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-background rounded-t-3xl p-5 space-y-4 safe-bottom"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-foreground">{editing ? "Редактировать адрес" : "Новый адрес"}</h2>
              <motion.button whileTap={{ scale: 0.85 }} onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <X size={16} className="text-muted-foreground" />
              </motion.button>
            </div>

            {/* Label select */}
            <div>
              <p className="text-sm font-bold text-foreground mb-2">Метка</p>
              <div className="flex gap-2">
                {labels.map((l) => (
                  <motion.button
                    key={l}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLabel(l)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      label === l ? "gradient-primary text-primary-foreground shadow-glow" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {l}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Address */}
            <div>
              <input
                value={address}
                onChange={(e) => { setAddress(e.target.value); setError(""); }}
                placeholder="Улица, дом, корпус"
                className={`${inputClass} border-2 ${error ? "border-destructive" : "border-transparent"}`}
              />
              {error && <p className="text-xs text-destructive mt-1">{error}</p>}
            </div>

            {/* Details */}
            <div className="grid grid-cols-3 gap-2">
              <input value={entrance} onChange={(e) => setEntrance(e.target.value)} placeholder="Подъезд" className={inputClass} />
              <input value={floor} onChange={(e) => setFloor(e.target.value)} placeholder="Этаж" className={inputClass} />
              <input value={apartment} onChange={(e) => setApartment(e.target.value)} placeholder="Квартира" className={inputClass} />
            </div>

            {/* Comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Например: домофон не работает"
              rows={2}
              className={`${inputClass} resize-none`}
            />

            {/* Actions */}
            <div className="flex gap-2">
              <motion.button whileTap={{ scale: 0.97 }} onClick={onClose} className="flex-1 py-3 rounded-xl bg-secondary text-muted-foreground font-bold text-sm">
                Отмена
              </motion.button>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} className="flex-1 py-3 rounded-xl gradient-primary text-primary-foreground font-bold text-sm shadow-glow">
                Сохранить
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddressFormModal;
