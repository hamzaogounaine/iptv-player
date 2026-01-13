import { Loader2 } from "lucide-react";
import Link from "next/link";
import React from "react";

function CategoryAccordion({
  categoryName
}) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors">
        <Link >
        {categoryName}
        </Link>
    </div>
  );
}

export default CategoryAccordion;
