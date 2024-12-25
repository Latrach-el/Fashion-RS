/* eslint-disable @next/next/no-img-element */
"use client";

import ProductCard from "@/components/product-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Product } from "@/lib/types";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const sortOptions = [
  { name: "Most Popular", value: "popular" },
  { name: "Newest", value: "newest" },
  { name: "Price: Low to High", value: "price-asc" },
  { name: "Price: High to Low", value: "price-desc" }
];

const filters = [
  {
    id: "season",
    name: "Season",
    options: [
      { value: "spring", label: "Spring" },
      { value: "summer", label: "Summer" },
      { value: "fall", label: "Fall" },
      { value: "winter", label: "Winter" }
    ]
  },
  {
    id: "articleType",
    name: "Product Type",
    options: [{ value: "tshirts", label: "T-Shirts" }]
  },
  {
    id: "baseColor",
    name: "Color",
    options: [{ value: "black", label: "Black" }]
  }
];

interface ProductsListProps {
  products: Product[];
}

export default function ProductsList({ products }: ProductsListProps) {
  const [activeFilters, setActiveFilters] = useState<Record<string, Set<string>>>({
    season: new Set<string>(),
    articleType: new Set<string>(),
    baseColor: new Set<string>()
  });
  const [sortBy, setSortBy] = useState("popular");

  const handleFilterChange = (sectionId: string, value: string, checked: boolean) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };
      const filterSet = new Set(prev[sectionId]);

      if (checked) {
        filterSet.add(value);
      } else {
        filterSet.delete(value);
      }

      newFilters[sectionId] = filterSet;
      return newFilters;
    });
  };

  const filteredProducts = products.filter((product) => {
    return (
      (activeFilters.season.size === 0 ||
        activeFilters.season.has(product.season?.toLowerCase())) &&
      (activeFilters.articleType.size === 0 ||
        activeFilters.articleType.has(product.articleType?.toLowerCase())) &&
      (activeFilters.baseColor.size === 0 ||
        activeFilters.baseColor.has(product.baseColor?.toLowerCase()))
    );
  });

  const FilterSection = ({
    section,
    mobile = false
  }: {
    section: (typeof filters)[0];
    mobile?: boolean;
  }) => (
    <div className="border-b border-gray-200 py-6">
      <h3 className="flow-root">
        <AccordionTrigger className="flex w-full items-center justify-between py-3 text-sm text-gray-400 hover:text-gray-500">
          <span className="font-medium text-gray-900">{section.name}</span>
        </AccordionTrigger>
      </h3>
      <AccordionContent>
        <div className="space-y-4 pt-6">
          {section.options.map((option) => (
            <div key={option.value} className="flex items-center">
              <Checkbox
                id={`filter-${mobile ? "mobile-" : ""}${section.id}-${option.value}`}
                checked={activeFilters[section.id].has(option.value)}
                onCheckedChange={(checked) =>
                  handleFilterChange(section.id, option.value, checked === true)
                }
              />
              <label
                htmlFor={`filter-${mobile ? "mobile-" : ""}${section.id}-${option.value}`}
                className="ml-3 text-sm text-gray-600">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </AccordionContent>
    </div>
  );

  return (
    <div className="">
      <div>
        {/* Mobile filter dialog */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <SlidersHorizontal className="h-5 w-5" />
              <span className="sr-only">Filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <Accordion type="single" collapsible>
                {filters.map((section) => (
                  <AccordionItem key={section.id} value={section.id}>
                    <FilterSection section={section} mobile={true} />
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </SheetContent>
        </Sheet>

        <main className="">
          <div className="flex items-baseline justify-end border-b border-gray-200 pb-6">
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-sm font-medium text-gray-700">
                    Sort
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {sortOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={sortBy === option.value ? "font-medium" : ""}>
                      {option.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
              {/* Desktop Filters */}
              <div className="hidden lg:block">
                <Accordion type="single" collapsible>
                  {filters.map((section) => (
                    <AccordionItem key={section.id} value={section.id}>
                      <FilterSection section={section} />
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              {/* Product grid */}
              <div className="lg:col-span-4">
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}

                  {filteredProducts.length === 0 && (
                    <div className="col-span-full py-10 text-center">
                      <p className="text-gray-500">No products match the selected filters.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
