import { useState } from "react";
import {
	Share2,
	MessageCircle,
	Twitter,
	Send,
	Link as LinkIcon,
	Check,
} from "lucide-react";
import { getSocialShareUrls } from "../../lib/utils";
import toast from "react-hot-toast";

const SocialShare = ({ title, url, description }) => {
	const [copied, setCopied] = useState(false);

	const shareUrls = getSocialShareUrls(title, url, description);

	const handleShare = (platform, shareUrl) => {
		if (platform === "copy") {
			navigator.clipboard.writeText(url);
			setCopied(true);
			toast.success("Link copiado com sucesso!");
			setTimeout(() => setCopied(false), 2000);
		} else {
			window.open(shareUrl, "_blank", "width=600,height=400");
		}
	};

	const shareButtons = [
		{
			platform: "whatsapp",
			icon: MessageCircle,
			color: "bg-green-500 hover:bg-green-600",
			url: shareUrls.whatsapp,
			label: "WhatsApp",
		},
		{
			platform: "facebook",
			icon: Share2,
			color: "bg-blue-600 hover:bg-blue-700",
			url: shareUrls.facebook,
			label: "Facebook",
		},
		{
			platform: "twitter",
			icon: Twitter,
			color: "bg-[#0f1419] hover:bg-sky-500",
			url: shareUrls.twitter,
			label: "Twitter",
		},
		{
			platform: "telegram",
			icon: Send,
			color: "bg-blue-400 hover:bg-blue-500",
			url: shareUrls.telegram,
			label: "Telegram",
		},
		{
			platform: "copy",
			icon: copied ? Check : LinkIcon,
			color: copied
				? "bg-green-500 hover:bg-green-600"
				: "bg-gray-500 hover:bg-gray-600",
			url: url,
			label: copied ? "Copiado!" : "Copiar Link",
		},
	];

	return (
		<div className="bg-white rounded-lg shadow-md p-6">
			<h3 className="text-lg font-semibold text-navy mb-4 flex items-center space-x-2">
				<Share2 className="w-5 h-5" />
				<span>Compartilhar esta matéria</span>
			</h3>

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
				{shareButtons.map(
					({ platform, icon: Icon, color, url, label }) => (
						<button
							key={platform}
							onClick={() => handleShare(platform, url)}
							className={`flex flex-col items-center justify-center p-3 rounded-lg text-white transition-colors ${color}`}
							title={`Compartilhar no ${label}`}
						>
							<Icon className="w-5 h-5 mb-1" />
							<span className="text-xs font-medium">{label}</span>
						</button>
					),
				)}
			</div>

			<div className="mt-4 text-sm text-text-secondary text-center">
				<p>Compartilhe esta matéria com seus amigos e seguidores</p>
			</div>
		</div>
	);
};

export default SocialShare;
