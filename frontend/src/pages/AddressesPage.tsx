import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAddresses, type Address } from "@/hooks/useAddresses";
import AddressCard from "@/components/AddressCard";
import AddressFormModal from "@/components/AddressFormModal";
import { toast } from "sonner";

const AddressesPage = () => {
  const navigate = useNavigate();
  const { addresses, addAddress, updateAddress, deleteAddress } = useAddresses();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  const handleEdit = (addr: Address) => {
    setEditing(addr);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleSave = (data: Omit<Address, "id">) => {
    if (editing) {
      updateAddress(editing.id, data);
      toast.success("Адрес обновлён");
    } else {
      addAddress(data);
      toast.success("Адрес добавлен");
    }
  };

  const handleDelete = (id: string) => {
    deleteAddress(id);
    toast.success("Адрес удалён");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="px-4 pt-4 pb-2 flex items-center gap-3">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </motion.button>
        <div>
          <h1 className="text-xl font-extrabold font-display text-foreground">Адреса доставки</h1>
          <p className="text-xs text-muted-foreground">Добавьте адреса, чтобы оформлять заказы быстрее</p>
        </div>
      </header>

      <div className="px-4 mt-4 space-y-3">
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-muted-foreground">
            <MapPin size={56} className="mb-4 opacity-20" />
            <p className="font-bold text-lg">У вас пока нет сохранённых адресов</p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAdd}
              className="mt-6 gradient-primary text-primary-foreground py-3 px-8 rounded-2xl font-bold shadow-glow"
            >
              Добавить адрес
            </motion.button>
          </div>
        ) : (
          <>
            <AnimatePresence>
              {addresses.map((addr) => (
                <AddressCard key={addr.id} address={addr} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-border text-muted-foreground font-bold text-sm"
            >
              <Plus size={16} /> Добавить адрес
            </motion.button>
          </>
        )}
      </div>

      <AddressFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} editing={editing} />
    </div>
  );
};

export default AddressesPage;
