import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

/**
 * ValidationErrorsDialog
 * Shows a popup listing all validation errors when Save or Next fails.
 * 
 * @param {boolean} open - Whether the dialog is open
 * @param {function} onOpenChange - Callback when dialog open state changes
 * @param {string[]} messages - Array of error messages to display
 */
const ValidationErrorsDialog = ({ open, onOpenChange, messages = [] }) => {
  // Remove duplicates and empty messages
  const uniqueMessages = [...new Set(messages.filter(msg => msg && msg.trim()))];

  if (uniqueMessages.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" style={{ padding: '18px' }}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-red-600">
            Please fill the following
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          <ul className="space-y-2">
            {uniqueMessages.map((message, index) => (
              <li 
                key={index} 
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span className="text-red-500 mt-0.5">•</span>
                <span>{message}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-red-600 hover:text-red-700 bg-transparent border border-red-600 hover:bg-red-600 hover:text-white"
          >
            Fill to continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ValidationErrorsDialog;
