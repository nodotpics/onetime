import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogoIcon } from '@/shared/icons/logo_icon';
import { GithubIcon } from '@/shared/icons/github_icon';

const headerLinks = [
  { label: 'Twitter', href: 'https://x.com/nodotpics' },
  { label: 'Telegram', href: 'https://t.me/nodotpics' },
  { label: 'Privacy', href: '/privacy' },
];

const isExternal = (href: string) => /^https?:\/\//i.test(href);

export const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center text-white py-4 px-10 max-sm:pt-10 max-sm:items-center max-sm:justify-center">
      <div className="flex items-center gap-10 max-sm:hidden">
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
      <Link to={'/'}>
        <LogoIcon />
      </Link>
      <div
        onClick={() => navigate('https://github.com/nodotpics/onetime')}
        className="flex items-center justify-center gap-2 rounded-full max-w-[167px] w-full py-3 bg-white text-black max-sm:hidden"
      >
        <GithubIcon />
        <span className="font-semibold">Repository</span>
      </div>
    </header>
  );
};
