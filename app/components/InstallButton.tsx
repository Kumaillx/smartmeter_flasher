"use client";

export default function InstallButton({ manifest }: { manifest: string }) {
  return (
    <esp-web-install-button manifest={manifest}></esp-web-install-button>
  );
}
