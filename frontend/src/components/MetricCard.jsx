import { motion } from "framer-motion";

export default function MetricCard({ title, value, caption, icon: Icon }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="card">
      <div className="flex justify-between items-start gap-3">
        <div>
          <p className="text-slate-300 text-sm">{title}</p>
          <p className="text-white text-2xl font-semibold mt-1">{value}</p>
          {caption ? <p className="text-slate-400 text-xs mt-1">{caption}</p> : null}
        </div>
        {Icon ? <Icon className="text-sky-300" size={20} /> : null}
      </div>
    </motion.div>
  );
}
