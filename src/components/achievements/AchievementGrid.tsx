'use client';

import React, { useState, useMemo } from 'react';
import { AchievementDefinition, UserAchievement } from '@/types/achievements';
import { AchievementCard } from './AchievementCard';
import { Sparkles, Trophy, Flame, Award, Filter, ArrowUpDown } from 'lucide-react';

export interface AchievementGridProps {
  definitions: AchievementDefinition[];
  userAchievements: UserAchievement[];
  onSelectAchievement?: (item: { definition: AchievementDefinition; userAchievement?: UserAchievement }) => void;
  className?: string;
}

export function AchievementGrid({
  definitions,
  userAchievements,
  onSelectAchievement,
  className = '',
}: AchievementGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'unlocked_first' | 'rarity'>('default');

  const earnedMap = useMemo(() => {
    const map = new Map<string, UserAchievement>();
    userAchievements.forEach(ua => {
      if (ua.achievement_definition_id) {
        map.set(ua.achievement_definition_id, ua);
      }
      const matchingDef = definitions.find(
        d => d.id === ua.achievement_definition_id || d.code === ua.achievement_definition_id
      );
      if (matchingDef) {
        map.set(matchingDef.id, ua);
        map.set(matchingDef.code, ua);
      }
    });
    return map;
  }, [userAchievements, definitions]);

  // Filter
  const filtered = useMemo(() => {
    return definitions.filter(d => {
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'performance') return d.category === 'performance';
      if (selectedCategory === 'streak') return d.category === 'streak';
      if (selectedCategory === 'test_completion') return d.category === 'test_completion';
      if (selectedCategory === 'personal_record') return d.category === 'personal_record';
      return true;
    });
  }, [definitions, selectedCategory]);

  // Sort
  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortBy === 'unlocked_first') {
      list.sort((a, b) => {
        const aUnlocked = earnedMap.has(a.id) ? 1 : 0;
        const bUnlocked = earnedMap.has(b.id) ? 1 : 0;
        return bUnlocked - aUnlocked;
      });
    } else if (sortBy === 'rarity') {
      const rarityRank: Record<string, number> = { legendary: 4, epic: 3, rare: 2, common: 1 };
      list.sort((a, b) => (rarityRank[b.rarity] || 0) - (rarityRank[a.rarity] || 0));
    }
    return list;
  }, [filtered, sortBy, earnedMap]);

  const categories = [
    { id: 'all', label: 'All', icon: Sparkles },
    { id: 'performance', label: 'Performance Pins', icon: Trophy },
    { id: 'streak', label: 'Streak Medals', icon: Flame },
    { id: 'test_completion', label: 'Completion', icon: Award },
    { id: 'personal_record', label: 'Records', icon: Award },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Controls: Filter & Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map(c => {
            const Icon = c.icon;
            const isActive = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-card border border-border text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-stone-700 dark:text-stone-300 focus:outline-none"
          >
            <option value="default">Default Order</option>
            <option value="unlocked_first">Unlocked First</option>
            <option value="rarity">Rarest First</option>
          </select>
        </div>
      </div>

      {/* Grid of Achievement Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sorted.map(d => {
          const userAchievement = earnedMap.get(d.id);
          return (
            <AchievementCard
              key={d.id}
              definition={d}
              userAchievement={userAchievement}
              onClick={() => onSelectAchievement && onSelectAchievement({ definition: d, userAchievement })}
            />
          );
        })}
      </div>
    </div>
  );
}
