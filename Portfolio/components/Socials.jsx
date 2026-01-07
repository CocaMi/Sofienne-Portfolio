import Link from "next/link";
import { 
  SiDocker

} from "react-icons/si";

import {
  RiGitlabLine,
  RiInstagramLine,
  RiFacebookLine,
  RiGithubLine,
  RiTelegramLine,
  RiLinkedinLine
} from "react-icons/ri";
import { FaDiscord } from "react-icons/fa";

export const socialData = [
  {
    name: "Github",
    link: "https://github.com/CocaMi",
    Icon: RiGithubLine,
  },
  {
    name: "Instagram",
    link: "https://www.instagram.com/cocami1230",
    Icon: RiInstagramLine,
  },
  {
    name: "Discord",
    link: "https://discord.com/users/301816089879511040",
    Icon: FaDiscord,
  },
  {
    name: "LinkedIn",
    link: "https://www.linkedin.com/in/sofienne-oueslati-001274259",
    Icon: RiLinkedinLine,
  },
  {
    name: "Telegram",
    link: "https://t.me/CocaMaple",
    Icon: RiTelegramLine,
  },
  {
    name: "Docker",
    link: "https://hub.docker.com/repositories/cocami",
    Icon: SiDocker,
  },
  {
    name: "Gitlab",
    link: "https://gitlab.com/users/cocacamille3/projects",
    Icon: RiGitlabLine,
  },
];

const Socials = () => {
  return (
    <div className="flex items-center gap-x-5 text-lg">
      {socialData.map((social, i) => (
        <Link
          key={i}
          title={social.name}
          href={social.link}
          target="_blank"
          rel="noreferrer noopener"
          className="hover:text-accent transition-all duration-300"
        >
          <social.Icon aria-hidden />
          <span className="sr-only">{social.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default Socials;
