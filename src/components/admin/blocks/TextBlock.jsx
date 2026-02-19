import { useState } from "react";
import RichTextEditor from "../RichTextEditor";
import ReactMarkdown from "react-markdown";

const TextBlock = ({ data, onChange, preview = false }) => {
	const handleChange = (field, value) => {
		if (onChange) {
			onChange({ [field]: value });
		}
	};

	if (preview) {
		if (!data.content) return null;

		return (
			<div className="my-6">
				<div className="text-lg leading-relaxed prose max-w-none">
					<ReactMarkdown>{data.content}</ReactMarkdown>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div>
				<label className="block text-sm font-medium text-navy mb-2">
					Texto
				</label>
				<RichTextEditor
					content={data.content || ""}
					onChange={(value) => handleChange("content", value)}
					placeholder="Digite seu texto aqui..."
				/>
				<div className="text-right text-xs text-text-secondary mt-1">
					{data.content?.length || 0} caracteres (Markdown)
				</div>
			</div>

			<div className="text-sm text-text-secondary">
				<p>Dicas:</p>
				<ul className="list-disc list-inside mt-2 space-y-1">
					<li>Use parágrafos curtos para melhor leitura</li>
					<li>Pressione Enter para criar novas linhas</li>
					<li>
						O texto será formatado automaticamente na visualização
					</li>
				</ul>
			</div>
		</div>
	);
};

export default TextBlock;
