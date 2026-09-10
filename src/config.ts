import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "YidianHub 文章",
	subtitle: "记录服务、工具与思考",
	lang: "zh_CN",
	themeColor: {
		hue: 172,
		fixed: true,
	},
	banner: {
		enable: false,
		src: "",
		position: "center",
		credit: {
			enable: false,
			text: "",
		},
	},
	toc: {
		enable: true,
		depth: 4,
	},
	favicon: [],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "主站",
			url: "https://yidianhub.com",
			external: true,
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "/yidianhub-mark.svg",
	name: "YidianHub",
	bio: "记录服务、工具与日常使用中的思考。",
	links: [
		{
			name: "主站",
			icon: "fa6-solid:house",
			url: "https://yidianhub.com",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: false,
	name: "",
	url: "",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	theme: "github-dark",
};
