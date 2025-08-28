import React from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { trackProductInteraction } from '@/utils/analytics';

interface ShareButtonProps {
  productId: string;
  productName: string;
  productSlug: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  className?: string;
}

const ShareButton = ({ 
  productId, 
  productName, 
  productSlug, 
  size = 'sm', 
  variant = 'ghost',
  className = ''
}: ShareButtonProps) => {
  
  const handleShare = async () => {
    trackProductInteraction(productId, 'share', 2);
    
    const shareData = {
      title: `${productName} - ShineVeda Exports`,
      text: `Check out this premium agricultural product: ${productName}`,
      url: `${window.location.origin}/products/${productSlug}`
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast.success('Product shared successfully!');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          // Fallback to clipboard if sharing was not aborted by user
          await copyToClipboard(shareData.url);
        }
      }
    } else {
      // Fallback to clipboard
      await copyToClipboard(shareData.url);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Product link copied to clipboard!');
    } catch (error) {
      // Final fallback - create a temporary textarea
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Product link copied to clipboard!');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleShare}
      className={className}
      aria-label={`Share ${productName}`}
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
};

export default ShareButton;