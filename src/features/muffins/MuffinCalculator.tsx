import React, { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { Cookie } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const MUFFIN_WEIGHT = 165; // grams
const FRUIT_PERCENTAGE = 0.15; // 15%

const MuffinCalculator: React.FC = () => {
  const [muffinCount, setMuffinCount] = useState(6);
  const { theme } = useTheme();

  const totalWeight = muffinCount * MUFFIN_WEIGHT;
  const fruitWeight = totalWeight * FRUIT_PERCENTAGE;
  const doughWeight = totalWeight - fruitWeight;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className={`text-2xl font-bold mb-6 ${
        theme === 'mati' ? 'text-white' : 'text-slate-800'
      }`}>Muffin Calculator</h1>
      
      <div className={`rounded-lg shadow-md p-6 mb-6 ${
        theme === 'mati'
          ? 'bg-zinc-900 text-white'
          : 'bg-white text-slate-800'
      }`}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Cookie size={24} className={
              theme === 'mati' ? 'text-red-500' : 'text-purple-600'
            } />
            <span className="text-xl font-semibold">Number of Muffins</span>
          </div>
          <span className={`text-2xl font-bold ${
            theme === 'mati' ? 'text-red-500' : 'text-purple-600'
          }`}>{muffinCount}</span>
        </div>
        
        <div className="px-4 mb-8">
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={[muffinCount]}
            onValueChange={([value]) => setMuffinCount(value)}
            max={100}
            min={1}
            step={1}
          >
            <Slider.Track className={`relative grow rounded-full h-2 ${
              theme === 'mati' ? 'bg-zinc-800' : 'bg-slate-200'
            }`}>
              <Slider.Range className={`absolute rounded-full h-full ${
                theme === 'mati' ? 'bg-red-600' : 'bg-purple-600'
              }`} />
            </Slider.Track>
            <Slider.Thumb
              className={`block w-6 h-6 rounded-full focus:outline-none focus:shadow-[0_0_0_2px] ${
                theme === 'mati'
                  ? 'bg-white border-2 border-red-600 hover:bg-red-50 focus:shadow-red-500'
                  : 'bg-white border-2 border-purple-600 hover:bg-purple-50 focus:shadow-purple-500'
              }`}
              aria-label="Number of muffins"
            />
          </Slider.Root>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-4 rounded-lg ${
            theme === 'mati'
              ? 'bg-red-900/20'
              : 'bg-purple-50'
          }`}>
            <h3 className={`text-sm font-medium mb-1 ${
              theme === 'mati' ? 'text-red-300' : 'text-purple-800'
            }`}>Dough Needed</h3>
            <p className={`text-2xl font-bold ${
              theme === 'mati' ? 'text-white' : 'text-slate-900'
            }`}>{doughWeight.toFixed(1)}g</p>
            <p className={`text-sm mt-1 ${
              theme === 'mati' ? 'text-red-400' : 'text-purple-600'
            }`}>
              {((doughWeight / totalWeight) * 100).toFixed(1)}% of total weight
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${
            theme === 'mati'
              ? 'bg-amber-900/20'
              : 'bg-orange-50'
          }`}>
            <h3 className={`text-sm font-medium mb-1 ${
              theme === 'mati' ? 'text-amber-300' : 'text-orange-800'
            }`}>Fruit Needed</h3>
            <p className={`text-2xl font-bold ${
              theme === 'mati' ? 'text-white' : 'text-slate-900'
            }`}>{fruitWeight.toFixed(1)}g</p>
            <p className={`text-sm mt-1 ${
              theme === 'mati' ? 'text-amber-400' : 'text-orange-600'
            }`}>
              {((fruitWeight / totalWeight) * 100).toFixed(1)}% of total weight
            </p>
          </div>
        </div>
      </div>
      
      <div className={`rounded-lg shadow-md p-6 ${
        theme === 'mati'
          ? 'bg-zinc-900 text-white'
          : 'bg-white text-slate-800'
      }`}>
        <h2 className="text-lg font-semibold mb-4">Recipe Notes</h2>
        <ul className={`space-y-2 ${
          theme === 'mati' ? 'text-gray-300' : 'text-slate-700'
        }`}>
          <li>• Each muffin weighs {MUFFIN_WEIGHT}g</li>
          <li>• {(FRUIT_PERCENTAGE * 100)}% of each muffin is fruit</li>
          <li>• Total batch weight: {totalWeight}g</li>
        </ul>
      </div>
    </div>
  );
};

export default MuffinCalculator;