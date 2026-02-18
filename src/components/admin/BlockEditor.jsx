import { useState, useCallback } from "react";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	Plus,
	GripVertical,
	Image,
	Type,
	Video,
	Link as LinkIcon,
	Megaphone,
	Trash2,
	Edit,
	Eye,
	EyeOff,
} from "lucide-react";

// Block Components
import CoverBlock from "./blocks/CoverBlock";
import TextBlock from "./blocks/TextBlock";
import ImageBlock from "./blocks/ImageBlock";
import ImageTextBlock from "./blocks/ImageTextBlock";
import VideoBlock from "./blocks/VideoBlock";
import ButtonBlock from "./blocks/ButtonBlock";
import ImageLinkBlock from "./blocks/ImageLinkBlock";
import CarouselBlock from "./blocks/CarouselBlock";
import AdBlock from "./blocks/AdBlock";

const BlockEditor = ({ value, onChange, preview = false }) => {
	const [blocks, setBlocks] = useState(value || []);
	const [showPreview, setShowPreview] = useState(preview);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const updateBlocks = useCallback(
		(newBlocks) => {
			setBlocks(newBlocks);
			onChange(newBlocks);
		},
		[onChange],
	);

	const addBlock = (type) => {
		const newBlock = {
			id: `block_${Date.now()}`,
			type,
			data: getDefaultData(type),
		};
		updateBlocks([...blocks, newBlock]);
	};

	const updateBlock = (blockId, newData) => {
		updateBlocks(
			blocks.map((block) =>
				block.id === blockId
					? { ...block, data: { ...block.data, ...newData } }
					: block,
			),
		);
	};

	const removeBlock = (blockId) => {
		updateBlocks(blocks.filter((block) => block.id !== blockId));
	};

	const duplicateBlock = (blockId) => {
		const blockToDuplicate = blocks.find((block) => block.id === blockId);
		if (blockToDuplicate) {
			const newBlock = {
				...blockToDuplicate,
				id: `block_${Date.now()}`,
				data: { ...blockToDuplicate.data },
			};
			updateBlocks([...blocks, newBlock]);
		}
	};

	const handleDragEnd = (event) => {
		const { active, over } = event;

		if (active.id !== over.id) {
			const oldIndex = blocks.findIndex(
				(block) => block.id === active.id,
			);
			const newIndex = blocks.findIndex((block) => block.id === over.id);

			updateBlocks(arrayMove(blocks, oldIndex, newIndex));
		}
	};

	const getDefaultData = (type) => {
		switch (type) {
			case "capa":
				return {
					title: "",
					imageUrl: "",
					alt: "",
					showInBody: true,
				};
			case "text":
				return {
					content: "",
				};
			case "fullImage":
				return {
					imageUrl: "",
					alt: "",
					caption: "",
				};
			case "imageText":
				return {
					imageUrl: "",
					alt: "",
					text: "",
					align: "left",
				};
			case "video":
				return {
					videoUrl: "",
					title: "",
				};
			case "button":
				return {
					text: "",
					url: "",
					style: "primary",
				};
			case "imagemComLink":
				return {
					imageUrl: "",
					linkUrl: "",
					alt: "",
					caption: "",
					showOverlay: true,
				};
			case "carousel":
				return {
					images: [],
				};
			case "ad":
				return {
					code: "",
					type: "adsense",
				};
			default:
				return {};
		}
	};

	const blockTypes = [
		{
			type: "text",
			label: "Texto",
			icon: Type,
			description: "Adicionar bloco de texto",
		},
		{
			type: "capa",
			label: "Capa",
			icon: Image,
			description: "Imagem de capa com título",
		},
		{
			type: "fullImage",
			label: "Imagem",
			icon: Image,
			description: "Imagem em tamanho completo",
		},
		{
			type: "imagemComLink",
			label: "Imagem com Link",
			icon: LinkIcon,
			description: "Imagem clicável com link",
		},
		{
			type: "imageText",
			label: "Imagem + Texto",
			icon: Image,
			description: "Imagem ao lado do texto",
		},
		{
			type: "carousel",
			label: "Carrossel",
			icon: Image,
			description: "Carrossel de múltiplas imagens",
		},
		{
			type: "video",
			label: "Vídeo",
			icon: Video,
			description: "Vídeo do YouTube",
		},
		{
			type: "button",
			label: "Botão",
			icon: LinkIcon,
			description: "Botão de chamada para ação",
		},
		{
			type: "ad",
			label: "Anúncio",
			icon: Megaphone,
			description: "Bloco de anúncio",
		},
	];

	const renderBlock = (block) => {
		const blockComponents = {
			capa: CoverBlock,
			text: TextBlock,
			fullImage: ImageBlock,
			imagemComLink: ImageLinkBlock,
			imageText: ImageTextBlock,
			carousel: CarouselBlock,
			video: VideoBlock,
			button: ButtonBlock,
			ad: AdBlock,
		};

		const BlockComponent = blockComponents[block.type];
		if (!BlockComponent) return null;

		if (showPreview) {
			return <BlockComponent key={block.id} data={block.data} preview />;
		}

		return (
			<SortableBlockItem
				key={block.id}
				block={block}
				onUpdate={(data) => updateBlock(block.id, data)}
				onRemove={() => removeBlock(block.id)}
				onDuplicate={() => duplicateBlock(block.id)}
			>
				<BlockComponent
					data={block.data}
					onChange={(data) => updateBlock(block.id, data)}
				/>
			</SortableBlockItem>
		);
	};

	if (showPreview) {
		return (
			<div className="space-y-6">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-lg font-semibold text-navy">
						Visualização
					</h3>
					<button
						onClick={() => setShowPreview(false)}
						className="btn-outline flex items-center space-x-2"
					>
						<Edit className="w-4 h-4" />
						<span>Editar</span>
					</button>
				</div>
				{blocks.map(renderBlock)}
				{blocks.length === 0 && (
					<div className="text-center py-12 text-text-secondary">
						<p>Nenhum conteúdo adicionado ainda.</p>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-lg font-semibold text-navy">
					Editor de Conteúdo
				</h3>
				<div className="flex items-center space-x-2">
					<button
						onClick={() => setShowPreview(true)}
						className="btn-outline flex items-center space-x-2"
					>
						<Eye className="w-4 h-4" />
						<span>Visualizar</span>
					</button>
				</div>
			</div>

			{/* Add Block Buttons */}
			<div className="bg-gray-50 rounded-lg p-4">
				<h4 className="text-sm font-medium text-navy mb-3">
					Adicionar Bloco
				</h4>
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
					{blockTypes.map(({ type, label, icon: Icon }) => (
						<button
							key={type}
							onClick={() => addBlock(type)}
							className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-teal-primary hover:bg-teal-50 transition-colors"
						>
							<Icon className="w-5 h-5 text-teal-primary mb-1" />
							<span className="text-xs font-medium text-navy">
								{label}
							</span>
						</button>
					))}
				</div>
			</div>

			{/* Blocks List */}
			{blocks.length > 0 ? (
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={blocks.map((block) => block.id)}
						strategy={verticalListSortingStrategy}
					>
						<div className="space-y-4">
							{blocks.map(renderBlock)}
						</div>
					</SortableContext>
				</DndContext>
			) : (
				<div className="text-center py-12 bg-gray-50 rounded-lg">
					<div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
						<Plus className="w-8 h-8 text-gray-400" />
					</div>
					<h3 className="text-lg font-medium text-navy mb-2">
						Nenhum bloco adicionado
					</h3>
					<p className="text-text-secondary mb-4">
						Comece adicionando blocos para construir sua matéria.
					</p>
					<div className="flex flex-wrap justify-center gap-2">
						{blockTypes
							.slice(0, 3)
							.map(({ type, label, icon: Icon }) => (
								<button
									key={type}
									onClick={() => addBlock(type)}
									className="btn-primary flex items-center space-x-2"
								>
									<Icon className="w-4 h-4" />
									<span>Adicionar {label}</span>
								</button>
							))}
					</div>
				</div>
			)}
		</div>
	);
};

// Sortable Block Item Component
const SortableBlockItem = ({
	block,
	onUpdate,
	onRemove,
	onDuplicate,
	children,
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: block.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const getBlockLabel = (type) => {
		const labels = {
			capa: "Capa",
			text: "Texto",
			fullImage: "Imagem",
			imageText: "Imagem + Texto",
			video: "Vídeo",
			button: "Botão",
			ad: "Anúncio",
		};
		return labels[type] || type;
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${isDragging ? "shadow-lg" : "shadow-sm"}`}
		>
			{/* Block Header */}
			<div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
				<div className="flex items-center space-x-3">
					<button
						{...attributes}
						{...listeners}
						className="p-1 hover:bg-gray-200 rounded transition-colors cursor-grab active:cursor-grabbing"
					>
						<GripVertical className="w-4 h-4 text-text-secondary" />
					</button>
					<span className="text-sm font-medium text-navy">
						{getBlockLabel(block.type)}
					</span>
				</div>

				<div className="flex items-center space-x-1">
					<button
						onClick={onDuplicate}
						className="p-1 hover:bg-gray-200 rounded transition-colors"
						title="Duplicar bloco"
					>
						<Plus className="w-4 h-4 text-text-secondary" />
					</button>
					<button
						onClick={onRemove}
						className="p-1 hover:bg-red-50 rounded transition-colors"
						title="Remover bloco"
					>
						<Trash2 className="w-4 h-4 text-red-500" />
					</button>
				</div>
			</div>

			{/* Block Content */}
			<div className="p-4">{children}</div>
		</div>
	);
};

export default BlockEditor;
