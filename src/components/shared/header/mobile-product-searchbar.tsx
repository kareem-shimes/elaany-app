"use client";
import { SearchIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function MobileProductSearchbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Perform search action
      console.log("Searching for:", searchQuery);
      // You can redirect to search page or trigger search API here
      // Example: router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false); // Close the dialog after search
    }
  };

  return (
    <div className="xl:hidden">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button type="button" className="element-center">
            <SearchIcon className="h-5 w-5" />
          </button>
        </DialogTrigger>
        <DialogContent className="w-[95vw] max-w-md mx-auto top-[20%] translate-y-0">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-left">Search Products</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 bg-input h-12 rounded-[62px] px-4">
              <SearchIcon className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-none bg-transparent focus-visible:ring-0 flex-1"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={!searchQuery.trim()}
              >
                Search
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
