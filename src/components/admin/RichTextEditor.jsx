import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import { Markdown } from "tiptap-markdown";
import {
	Bold,
	Italic,
	List,
	Heading2,
	Heading3,
	Link as LinkIcon,
	Unlink,
	Check,
	X,
	ExternalLink,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const LinkPopover = ({ editor, isOpen, onClose }) => {
	const [url, setUrl] = useState("");

	useEffect(() => {
		if (isOpen) {
			const previousUrl = editor.getAttributes("link").href;
			setUrl(previousUrl || "");
		}
	}, [isOpen, editor]);

	const handleSubmit = (e) => {
		e.preventDefault();

		if (url === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
		} else {
			editor
				.chain()
				.focus()
				.extendMarkRange("link")
				.setLink({ href: url })
				.run();
		}

		onClose();
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
			onClick={onClose}
		>
			<div
				className="bg-white rounded-lg shadow-xl p-4 w-full max-w-sm mx-4"
				onClick={(e) => e.stopPropagation()}
			>
				<h3 className="text-lg font-semibold mb-4 text-navy">
					Adicionar Link
				</h3>
				<form onSubmit={handleSubmit}>
					<input
						type="url"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder="https://exemplo.com"
						className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-teal-primary"
						autoFocus
					/>
					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-teal-primary text-white rounded-md hover:bg-teal-900 transition-colors"
						>
							Salvar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

const MenuBar = ({ editor, onLinkClick }) => {
	if (!editor) {
		return null;
	}

	return (
		<div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50 items-center">
			<button
				onClick={() =>
					editor.chain().focus().toggleHeading({ level: 2 }).run()
				}
				className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
					editor.isActive("heading", { level: 2 })
						? "bg-gray-200 text-teal-primary"
						: "text-gray-600"
				}`}
				title="Título H2"
			>
				<Heading2 size={18} />
			</button>
			<button
				onClick={() =>
					editor.chain().focus().toggleHeading({ level: 3 }).run()
				}
				className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
					editor.isActive("heading", { level: 3 })
						? "bg-gray-200 text-teal-primary"
						: "text-gray-600"
				}`}
				title="Título H3"
			>
				<Heading3 size={18} />
			</button>

			<div className="w-px h-5 bg-gray-300 mx-1" />

			<button
				onClick={() => editor.chain().focus().toggleBold().run()}
				disabled={!editor.can().chain().focus().toggleBold().run()}
				className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
					editor.isActive("bold")
						? "bg-gray-200 text-teal-primary"
						: "text-gray-600"
				}`}
				title="Negrito"
			>
				<Bold size={18} />
			</button>
			<button
				onClick={() => editor.chain().focus().toggleItalic().run()}
				disabled={!editor.can().chain().focus().toggleItalic().run()}
				className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
					editor.isActive("italic")
						? "bg-gray-200 text-teal-primary"
						: "text-gray-600"
				}`}
				title="Itálico"
			>
				<Italic size={18} />
			</button>

			<div className="w-px h-5 bg-gray-300 mx-1" />

			<button
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
					editor.isActive("bulletList")
						? "bg-gray-200 text-teal-primary"
						: "text-gray-600"
				}`}
				title="Lista"
			>
				<List size={18} />
			</button>

			<div className="w-px h-5 bg-gray-300 mx-1" />

			<button
				onClick={onLinkClick}
				className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
					editor.isActive("link")
						? "bg-gray-200 text-teal-primary"
						: "text-gray-600"
				}`}
				title="Link"
			>
				<LinkIcon size={18} />
			</button>

			{editor.isActive("link") && (
				<button
					onClick={() => editor.chain().focus().unsetLink().run()}
					className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition-colors"
					title="Remover Link"
				>
					<Unlink size={18} />
				</button>
			)}
		</div>
	);
};

const RichTextEditor = ({ content, onChange, placeholder }) => {
	const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);

	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: {
					levels: [2, 3],
				},
				// Exclude Link from StarterKit to avoid duplication
				// as we are configuring it separately below
				link: false,
			}),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: "text-teal-primary hover:underline cursor-pointer",
				},
			}),
			Markdown.configure({
				html: false,
				transformPastedText: true,
				transformCopiedText: true,
			}),
			BubbleMenuExtension,
		],
		content: content || "",
		editorProps: {
			attributes: {
				class: "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[200px] px-4 py-3",
			},
		},
		onUpdate: ({ editor }) => {
			try {
				const markdown = editor.storage.markdown.getMarkdown();
				onChange(markdown);
			} catch (error) {
				console.error("Error getting markdown:", error);
			}
		},
	});

	// Update editor content if prop changes externally (e.g. initial load)
	useEffect(() => {
		if (editor && content) {
			const currentContent = editor.storage.markdown.getMarkdown();
			if (!currentContent && content) {
				editor.commands.setContent(content);
			}
		}
	}, [content, editor]);

	const openLinkModal = useCallback(() => {
		setIsLinkPopoverOpen(true);
	}, []);

	return (
		<div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-primary focus-within:border-transparent transition-all shadow-sm relative">
			<MenuBar editor={editor} onLinkClick={openLinkModal} />

			{editor && (
				<BubbleMenu
					editor={editor}
					shouldShow={({ editor, from, to }) => {
						return from !== to && editor.isActive("link");
					}}
					className="bg-white shadow-xl border border-gray-200 rounded-lg p-1 flex items-center gap-1"
				>
					<button
						onClick={openLinkModal}
						className="p-1.5 hover:bg-gray-100 rounded text-teal-primary"
						title="Editar Link"
					>
						<LinkIcon size={14} />
					</button>
					<a
						href={editor.getAttributes("link").href}
						target="_blank"
						rel="noopener noreferrer"
						className="p-1.5 hover:bg-gray-100 rounded text-gray-600"
						title="Visitar Link"
					>
						<ExternalLink size={14} />
					</a>
					<button
						onClick={() => editor.chain().focus().unsetLink().run()}
						className="p-1.5 hover:bg-gray-100 rounded text-red-500"
						title="Remover Link"
					>
						<Unlink size={14} />
					</button>
				</BubbleMenu>
			)}

			<EditorContent editor={editor} className="bg-white" />

			{editor && (
				<LinkPopover
					editor={editor}
					isOpen={isLinkPopoverOpen}
					onClose={() => setIsLinkPopoverOpen(false)}
				/>
			)}
		</div>
	);
};

export default RichTextEditor;
