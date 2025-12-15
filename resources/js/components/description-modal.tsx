import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';

interface DescriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    description: string;
    onDescriptionChange: (description: string) => void;
    title?: string;
    readOnly?: boolean;
}

export function DescriptionModal({
    isOpen,
    onClose,
    description,
    onDescriptionChange,
    title = 'Editar Descripción',
    readOnly = false,
}: DescriptionModalProps) {
    const [tempDescription, setTempDescription] = useState(description);

    useEffect(() => {
        setTempDescription(description);
    }, [description, isOpen]);

    const handleSave = () => {
        onDescriptionChange(tempDescription);
        onClose();
    };

    const handleCancel = () => {
        setTempDescription(description); // Reset to original
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[80vh] overflow-hidden sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Ingresa una descripción detallada para el evento.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <Textarea
                        value={tempDescription}
                        onChange={(e) =>
                            !readOnly && setTempDescription(e.target.value)
                        }
                        placeholder="Escribe la descripción del evento aquí..."
                        className="min-h-[300px] resize-none"
                        autoFocus={!readOnly}
                        readOnly={readOnly}
                    />
                </div>
                {!readOnly && (
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCancel}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSave}>
                            Guardar Descripción
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
