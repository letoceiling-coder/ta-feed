import { motion } from "framer-motion";
import { Pencil, Trash2, Home, Briefcase, MapPin } from "lucide-react";
import type { Address } from "@/hooks/useAddresses";

const labelIcons = {
  "Дом": Home,
  "Работа": Briefcase,
  "Другое": MapPin,
};

interface Props {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
}

const AddressCard = ({ address, onEdit, onDelete }: Props) => {
  const Icon = labelIcons[address.label] || MapPin;
  const details = [address.entrance && `подъезд ${address.entrance}`, address.floor && `этаж ${address.floor}`, address.apartment && `кв. ${address.apartment}`].filter(Boolean).join(", ");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      className="bg-card rounded-2xl p-4 shadow-card"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon size={18} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-card-foreground">{address.label}</p>
          <p className="text-sm text-muted-foreground mt-0.5 truncate">{address.address}</p>
          {details && <p className="text-xs text-muted-foreground mt-0.5">{details}</p>}
          {address.comment && <p className="text-xs text-muted-foreground mt-0.5 italic">{address.comment}</p>}
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => onEdit(address)} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
            <Pencil size={14} className="text-muted-foreground" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => onDelete(address.id)} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
            <Trash2 size={14} className="text-destructive" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AddressCard;
