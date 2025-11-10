
import Link from 'next/link';
import Image from 'next/image';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <Image src="https://i.ibb.co/h1X4FPxF/5261fa16-9817-4c6a-924e-9f5aaf3c9d57.jpg" alt="EDU Smart Logo" width={60} height={21} className="object-contain" />
    </Link>
  );
}
