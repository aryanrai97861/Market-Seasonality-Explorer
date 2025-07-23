
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ColorSchemeSelectorProps {
  currentScheme: 'default' | 'colorblind' | 'high-contrast';
  onSchemeChange: (scheme: 'default' | 'colorblind' | 'high-contrast') => void;
}

export default function ColorSchemeSelector({ currentScheme, onSchemeChange }: ColorSchemeSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-slate-800 rounded-xl p-4 border border-slate-700"
    >
      <div className="flex items-center space-x-2 mb-2">
        <Palette className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-300">Color Scheme</span>
      </div>
      <Select value={currentScheme} onValueChange={onSchemeChange}>
        <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600">
          <SelectItem value="default" className="text-white hover:bg-slate-600">
            Default
          </SelectItem>
          <SelectItem value="colorblind" className="text-white hover:bg-slate-600">
            Colorblind Friendly
          </SelectItem>
          <SelectItem value="high-contrast" className="text-white hover:bg-slate-600">
            High Contrast
          </SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
}
