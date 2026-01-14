"use client";
import { useIptv } from "@/hooks/iptvContext";
import Link from "next/link";
import React, { useEffect } from "react";

const Categories = () => {
  const { fetchCategories, categories, loading } = useIptv();

   useEffect(() => {
     
     fetchCategories();
    }, []);

  if (!categories && loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-zinc-700 border-t-zinc-400 rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl text-zinc-400">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Categories</h1>

        {categories && (
          <div className="space-y-3">
            {categories.map((cat) => (
              <Link
                href={cat.category_id}
                key={cat.category_id}
                className="block"
              >
                <div className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg py-4 px-6 transition-all duration-200">
                  <span className="text-white text-lg">{cat.category_name}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;