import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Reservation } from '@/types';
import { format } from 'date-fns';

interface ReservationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation?: Reservation;
  onSubmit: (data: ReservationFormData) => void;
  isLoading?: boolean;
}

export interface ReservationFormData {
  date: string;
  name: string;
  surname: string;
  address: string;
  phone: string;
  menu: string;
  deposit: number;
  hall: string;
}

const HALLS = ['Hall A', 'Hall B', 'Hall C', 'Private Room', 'Garden', 'Rooftop'];
const MENUS = ['Standard Menu', 'Premium Menu', 'Wedding Package', 'Corporate Package', 'Custom Menu'];

export function ReservationForm({ 
  open, 
  onOpenChange, 
  reservation, 
  onSubmit, 
  isLoading = false 
}: ReservationFormProps) {
  const [formData, setFormData] = useState<ReservationFormData>({
    date: reservation ? reservation.date : format(new Date(), 'yyyy-MM-dd'),
    name: reservation?.name || '',
    surname: reservation?.surname || '',
    address: reservation?.address || '',
    phone: reservation?.phone || '',
    menu: reservation?.menu || '',
    deposit: reservation?.deposit || 0,
    hall: reservation?.hall || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen && !reservation) {
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        name: '',
        surname: '',
        address: '',
        phone: '',
        menu: '',
        deposit: 0,
        hall: '',
      });
    }
  };

  const updateField = (field: keyof ReservationFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isValid = formData.name && formData.surname && formData.date && formData.phone;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-border/50">
        <DialogHeader>
          <DialogTitle>
            {reservation ? 'Edit Reservation' : 'New Reservation'}
          </DialogTitle>
          <DialogDescription>
            {reservation 
              ? 'Update the reservation details.'
              : 'Add a new reservation to this season.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => updateField('date', e.target.value)}
                className="bg-background/50"
              />
            </div>

            {/* Name & Surname */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">First Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="John"
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname">Last Name *</Label>
                <Input
                  id="surname"
                  value={formData.surname}
                  onChange={(e) => updateField('surname', e.target.value)}
                  placeholder="Doe"
                  className="bg-background/50"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="bg-background/50"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="123 Main St, City, State 12345"
                className="bg-background/50 min-h-[60px]"
              />
            </div>

            {/* Hall */}
            <div className="space-y-2">
              <Label htmlFor="hall">Hall</Label>
              <Select 
                value={formData.hall} 
                onValueChange={(value) => updateField('hall', value)}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select a hall" />
                </SelectTrigger>
                <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/50">
                  {HALLS.map((hall) => (
                    <SelectItem key={hall} value={hall}>
                      {hall}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Menu */}
            <div className="space-y-2">
              <Label htmlFor="menu">Menu</Label>
              <Select 
                value={formData.menu} 
                onValueChange={(value) => updateField('menu', value)}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select a menu" />
                </SelectTrigger>
                <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/50">
                  {MENUS.map((menu) => (
                    <SelectItem key={menu} value={menu}>
                      {menu}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Deposit */}
            <div className="space-y-2">
              <Label htmlFor="deposit">Deposit Amount ($)</Label>
              <Input
                id="deposit"
                type="number"
                min="0"
                step="0.01"
                value={formData.deposit}
                onChange={(e) => updateField('deposit', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="bg-background/50"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isValid || isLoading}
              className="bg-gradient-primary"
            >
              {isLoading ? 'Saving...' : (reservation ? 'Update' : 'Create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}