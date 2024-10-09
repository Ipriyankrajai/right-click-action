"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function RightClickDiv() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleRightClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMenuPosition({ x: e.clientX - rect.left, y: rect.bottom - rect.top });
    }
    setIsMenuOpen(true);
  }, []);

  const handleAction = useCallback((action: "delete" | "archive") => {
    console.log(`${action} action triggered`);
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div
        className="w-[300px] h-[300px] bg-secondary rounded-lg shadow-md flex items-center justify-center cursor-context-menu"
        onContextMenu={handleRightClick}
      >
        Right-click me
      </div>
      {isMenuOpen && (
        <div
          className="absolute bg-background border border-border rounded-md shadow-lg p-2 z-50"
          style={{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }}
        >
          <div className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleAction("delete")}
            >
              Delete
            </Button>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={() => handleAction("archive")}
            >
              Archive
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}