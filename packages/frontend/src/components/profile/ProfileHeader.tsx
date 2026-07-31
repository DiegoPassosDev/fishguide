"use client";

import { MapPin, Pencil } from "lucide-react";
import type { User } from "@/types/auth";

interface ProfileHeaderProps {
  user: User;
  onEdit: () => void;
}

function getLocation(user: User): string | null {
  const parts = [user.city, user.state, user.country].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

export function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
  const location = getLocation(user);
  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <section className="mb-3 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="h-20 bg-linear-to-br from-teal to-navy-mid" />
      <div className="px-5 pb-5">
        <div className="-mt-8 flex items-end justify-between">
          <div className="flex size-16 items-center justify-center rounded-full bg-linear-to-br from-sky-700 to-navy-mid text-lg font-bold text-white ring-4 ring-card">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.name}
                className="size-full rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <Pencil size={13} />
            Editar
          </button>
        </div>

        <div className="mt-3">
          <h1 className="font-heading text-lg font-bold text-foreground">{user.name}</h1>
          <p className="text-xs text-muted-foreground">@{user.email.split("@")[0]}</p>
          {location && (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin size={12} />
              {location}
            </p>
          )}
        </div>

        {user.bio && (
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">{user.bio}</p>
        )}
      </div>
    </section>
  );
}
