import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { propertyId } = await req.json();

    if (!propertyId) {
      return Response.json({ error: 'propertyId required' }, { status: 400 });
    }

    // Fetch property to get details
    const properties = await base44.entities.Property.filter({ id: propertyId });
    if (!properties.length) {
      return Response.json({ error: 'Property not found' }, { status: 404 });
    }
    
    const property = properties[0];
    const beds = property.beds || 2;
    const baths = property.baths || 1;

    // Generate dynamic capture guide based on property
    const guide = {
      totalShots: 0,
      rooms: []
    };

    // Exterior
    const exterior = {
      roomId: 'exterior',
      roomType: 'exterior',
      roomLabel: 'Building Exterior',
      roomLabelAr: 'واجهة المبنى',
      requiredShots: [
        {
          shotId: 'ext-1',
          shotName: 'Building Facade',
          shotNameAr: 'واجهة المبنى',
          description: 'Full view of building front',
          cameraPosition: 'Across street from building',
          angleGuide: 'Horizontal, level with building',
          isPrimary: true,
          tips: ['Afternoon light best', 'Include ground level', 'Show architectural details']
        },
        {
          shotId: 'ext-2',
          shotName: 'Building Entrance',
          shotNameAr: 'مدخل المبنى',
          description: 'Main entrance and lobby',
          cameraPosition: 'Inside lobby entrance',
          angleGuide: 'Looking at lobby from doorway',
          isPrimary: false,
          tips: ['Show security gate', 'Capture lighting', 'Include any signage']
        }
      ],
      optionalShots: []
    };
    guide.rooms.push(exterior);
    guide.totalShots += exterior.requiredShots.length;

    // Living Room
    const livingRoom = {
      roomId: 'living',
      roomType: 'living_room',
      roomLabel: 'Living Room',
      roomLabelAr: 'غرفة المعيشة',
      requiredShots: [
        {
          shotId: 'lr-1',
          shotName: 'Full Room Wide Angle',
          shotNameAr: 'الغرفة بزاوية عريضة',
          description: 'Full view from entrance door',
          cameraPosition: 'Standing at entrance',
          angleGuide: 'Straight ahead, level height',
          isPrimary: true,
          tips: ['Open curtains for natural light', 'Show ceiling height', 'Include furniture']
        },
        {
          shotId: 'lr-2',
          shotName: 'Corner View',
          shotNameAr: 'منظر الزاوية',
          description: 'Opposite corner showing full room',
          cameraPosition: 'Far corner from entrance',
          angleGuide: 'Back toward entrance',
          isPrimary: false,
          tips: ['Show room dimensions', 'Capture built-ins', 'Include seating area']
        },
        {
          shotId: 'lr-3',
          shotName: 'Window & View',
          shotNameAr: 'النافذة والمنظر',
          description: 'Looking out from window',
          cameraPosition: 'At window looking out',
          angleGuide: 'Toward exterior view',
          isPrimary: false,
          tips: ['Capture natural light', 'Show view quality', 'Include window frame']
        }
      ],
      optionalShots: []
    };
    guide.rooms.push(livingRoom);
    guide.totalShots += livingRoom.requiredShots.length;

    // Kitchen
    const kitchen = {
      roomId: 'kitchen',
      roomType: 'kitchen',
      roomLabel: 'Kitchen',
      roomLabelAr: 'المطبخ',
      requiredShots: [
        {
          shotId: 'k-1',
          shotName: 'Full Kitchen',
          shotNameAr: 'المطبخ كاملا',
          description: 'Entire kitchen from entrance',
          cameraPosition: 'At kitchen entrance',
          angleGuide: 'Full kitchen layout visible',
          isPrimary: true,
          tips: ['Show countertops', 'Capture appliances', 'Open all cabinets']
        },
        {
          shotId: 'k-2',
          shotName: 'Appliance Details',
          shotNameAr: 'تفاصيل الأجهزة',
          description: 'Close-up of kitchen appliances',
          cameraPosition: 'In front of main appliances',
          angleGuide: 'Facing cooktop/oven',
          isPrimary: false,
          tips: ['Show brand names', 'Capture condition', 'Include countertop details']
        }
      ],
      optionalShots: []
    };
    guide.rooms.push(kitchen);
    guide.totalShots += kitchen.requiredShots.length;

    // Master Bedroom
    const masterBed = {
      roomId: 'master',
      roomType: 'bedroom',
      roomLabel: 'Master Bedroom',
      roomLabelAr: 'غرفة النوم الرئيسية',
      requiredShots: [
        {
          shotId: 'mb-1',
          shotName: 'Full Bedroom',
          shotNameAr: 'الغرفة كاملة',
          description: 'Entire room from doorway',
          cameraPosition: 'At bedroom door',
          angleGuide: 'Straight into room',
          isPrimary: true,
          tips: ['Show room size', 'Open windows', 'Include closets']
        },
        {
          shotId: 'mb-2',
          shotName: 'Ensuite Bathroom',
          shotNameAr: 'حمام ملحق',
          description: 'Ensuite bathroom view',
          cameraPosition: 'Inside ensuite',
          angleGuide: 'Full bathroom view',
          isPrimary: false,
          tips: ['Show fixtures', 'Capture tub/shower', 'Include vanity']
        }
      ],
      optionalShots: []
    };
    guide.rooms.push(masterBed);
    guide.totalShots += masterBed.requiredShots.length;

    // Additional Bedrooms
    for (let i = 2; i <= beds; i++) {
      const bed = {
        roomId: `bed${i}`,
        roomType: 'bedroom',
        roomLabel: `Bedroom ${i}`,
        roomLabelAr: `غرفة النوم ${i}`,
        requiredShots: [
          {
            shotId: `b${i}-1`,
            shotName: 'Full Room',
            shotNameAr: 'الغرفة كاملة',
            description: 'Entire room from doorway',
            cameraPosition: 'At bedroom door',
            angleGuide: 'Straight into room',
            isPrimary: true,
            tips: ['Show room size', 'Capture closet', 'Include windows']
          }
        ],
        optionalShots: []
      };
      guide.rooms.push(bed);
      guide.totalShots += bed.requiredShots.length;
    }

    // Main Bathroom
    const mainBath = {
      roomId: 'bathroom',
      roomType: 'bathroom',
      roomLabel: 'Main Bathroom',
      roomLabelAr: 'الحمام الرئيسي',
      requiredShots: [
        {
          shotId: 'bath-1',
          shotName: 'Full Bathroom',
          shotNameAr: 'الحمام كاملا',
          description: 'Entire bathroom',
          cameraPosition: 'At bathroom door',
          angleGuide: 'Full bathroom visible',
          isPrimary: true,
          tips: ['Show fixtures', 'Capture tub/shower', 'Include vanity and mirror']
        }
      ],
      optionalShots: []
    };
    guide.rooms.push(mainBath);
    guide.totalShots += mainBath.requiredShots.length;

    // Balcony (if space allows)
    const balcony = {
      roomId: 'balcony',
      roomType: 'balcony',
      roomLabel: 'Balcony/Patio',
      roomLabelAr: 'الشرفة/الفناء',
      requiredShots: [
        {
          shotId: 'bal-1',
          shotName: 'Balcony Floor',
          shotNameAr: 'أرضية الشرفة',
          description: 'Looking across balcony',
          cameraPosition: 'On balcony floor',
          angleGuide: 'Showing floor space',
          isPrimary: true,
          tips: ['Show size', 'Capture railings', 'Check safety']
        },
        {
          shotId: 'bal-2',
          shotName: 'View from Balcony',
          shotNameAr: 'المنظر من الشرفة',
          description: 'Looking out from balcony',
          cameraPosition: 'At balcony edge (safely)',
          angleGuide: 'Toward horizon/view',
          isPrimary: false,
          tips: ['Show view quality', 'Capture surrounding area', 'Good lighting']
        }
      ],
      optionalShots: []
    };
    guide.rooms.push(balcony);
    guide.totalShots += balcony.requiredShots.length;

    // Parking
    const parking = {
      roomId: 'parking',
      roomType: 'parking',
      roomLabel: 'Parking Space',
      roomLabelAr: 'مكان وقوف السيارات',
      requiredShots: [
        {
          shotId: 'park-1',
          shotName: 'Parking Space',
          shotNameAr: 'مكان الوقوف',
          description: 'Parking spot assigned',
          cameraPosition: 'In parking area',
          angleGuide: 'Full parking space visible',
          isPrimary: true,
          tips: ['Show space number', 'Capture dimensions', 'Include access route']
        }
      ],
      optionalShots: []
    };
    guide.rooms.push(parking);
    guide.totalShots += parking.requiredShots.length;

    return Response.json(guide);
  } catch (error) {
    console.error('Error generating capture guide:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});