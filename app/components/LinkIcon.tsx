import type { LinkPlatform, ProjectLink } from "../data/portfolio";

// Brand marks from Simple Icons (simpleicons.org), drawn in currentColor so they follow the pill's text colour,
// including the white-to-black flip on hover
const brandPaths: Record<Exclude<LinkPlatform, "lookerstudio">, string> = {
  colab:
    "M16.9414 4.9757a7.033 7.033 0 0 0-4.9308 2.0646 7.033 7.033 0 0 0-.1232 9.8068l2.395-2.395a3.6455 3.6455 0 0 1 5.1497-5.1478l2.397-2.3989a7.033 7.033 0 0 0-4.8877-1.9297zM7.07 4.9855a7.033 7.033 0 0 0-4.8878 1.9316l2.3911 2.3911a3.6434 3.6434 0 0 1 5.0227.1271l1.7341-2.9737-.0997-.0802A7.033 7.033 0 0 0 7.07 4.9855zm15.0093 2.1721l-2.3892 2.3911a3.6455 3.6455 0 0 1-5.1497 5.1497l-2.4067 2.4068a7.0362 7.0362 0 0 0 9.9456-9.9476zM1.932 7.1674a7.033 7.033 0 0 0-.002 9.6816l2.397-2.397a3.6434 3.6434 0 0 1-.004-4.8916zm7.664 7.4235c-1.38 1.3816-3.5863 1.411-5.0168.1134l-2.397 2.395c2.4693 2.3328 6.263 2.5753 9.0072.5455l.1368-.1115z",
};

const hostPlatforms: [RegExp, LinkPlatform][] = [
  [/^colab\.research\.google\.com$/, "colab"],
  [/^lookerstudio\.google\.com$/, "lookerstudio"],
];

const platformOf = (link: ProjectLink): LinkPlatform | undefined => {
  if (link.platform) return link.platform;
  try {
    const host = new URL(link.href).hostname;
    return hostPlatforms.find(([pattern]) => pattern.test(host))?.[1];
  } catch {
    return undefined;
  }
};

/** The logo of the site a project link opens, placed before its label */
export default function LinkIcon({ link }: { link: ProjectLink }) {
  const platform = platformOf(link);
  if (platform && platform !== "lookerstudio") {
    return (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="currentColor" aria-hidden="true">
        <path d={brandPaths[platform]} />
      </svg>
    );
  }
  // Looker Studio has no mark in Simple Icons, so a dashboard is a bar chart. Anything else is a website (a
  // project's own site or app, on Vercel or Streamlit), shown as a globe rather than its host's logo.
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {platform === "lookerstudio" ? (
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      ) : (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </>
      )}
    </svg>
  );
}
