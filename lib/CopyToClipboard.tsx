// components/CopyToClipboard.tsx
'use client';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { RiFileCopyFill } from 'react-icons/ri';

type CopyToClipboardProps = {
	text: string;
	size?: string;
	textColor?: string;
};

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
	text,
	size,
	textColor = 'text-gray-600',
}) => {
	const [isCopied, setIsCopied] = useState(false);

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setIsCopied(true);
		} catch (error) {
			console.error('Failed to copy text: ', error);
		}
	};

	useEffect(() => {
		let timeout: NodeJS.Timeout;

		if (isCopied) {
			timeout = setTimeout(() => setIsCopied(false), 3000);
			toast.success('Copied to clipboard');
		}

		return () => clearTimeout(timeout);
	}, [isCopied]);

	return (
		<div className=''>
			<button onClick={copyToClipboard} className='flex items-center'>
				<RiFileCopyFill
					className={` inline-block ml-1 ${
						size ? size : 'text-sm'
					}  cursor-pointer ${isCopied ? 'text-htx-blue' : textColor} `}
				/>
			</button>
			{/* {isCopied && (
				<div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 p-2 rounded-md shadow-md'>
					<span className='text-white text-xs'>Copied!</span>
				</div>
			)} */}
		</div>
	);
};

export default CopyToClipboard;
