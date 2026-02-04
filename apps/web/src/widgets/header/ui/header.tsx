import { Link, NavLink } from 'react-router-dom';
import { LogoIcon } from '@/shared/icons/logo_icon';
import { GithubIcon } from '@/shared/icons/github_icon';

const headerLinks = [
  { label: 'Twitter', href: 'https://x.com/nodotpics' },
  { label: 'Telegram', href: 'https://t.me/nodotpics' },
  { label: 'Privacy', href: '/privacy' },
];

const isExternal = (href: string) => /^https?:\/\//i.test(href);

export const Header = () => {
  return (
    <header className="grid grid-cols-3 items-center text-white py-4 pl-10 pr-4 max-sm:pt-10 max-sm:px-4">
      <div className="flex items-center gap-10 max-sm:hidden justify-self-start">
        {headerLinks.map(({ label, href }) =>
          isExternal(href) ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition"
            >
              {label}
            </a>
          ) : (
            <NavLink
              key={label}
              to={href}
              className="hover:opacity-80 transition"
            >
              {label}
            </NavLink>
          )
        )}
      </div>

      <Link to="/" className="justify-self-center">
        <LogoIcon />
      </Link>

      <div className="flex items-center justify-end w-full">
        <a
          href="https://github.com/nodotpics/onetime"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-full max-w-[167px] w-full py-3 bg-white text-black max-sm:hidden hover:opacity-90 transition"
        >
          <GithubIcon />
          <span className="font-semibold">Repository</span>
        </a>
      </div>
    </header>
  );
};
