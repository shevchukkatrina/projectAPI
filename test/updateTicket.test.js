const updateTicket = require('../controllers/tickets/updateTicket');
const { Ticket, Event } = require('../models');

jest.mock('../models', () => ({
  Ticket: {
    findById: jest.fn(),
    countDocuments: jest.fn(),
  },
  Event: {
    findById: jest.fn(),
  },
}));

describe('updateTicket', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { id: 'ticket123' },
      body: { status: 'available' },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it('повертає 400, якщо статус невалідний або відсутній', async () => {
    req.body.status = 'invalidStatus';

    await updateTicket(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Valid status is required (available, reserved, sold, cancelled)',
    });
  });

  it('повертає 404, якщо квиток не знайдено', async () => {
    Ticket.findById.mockResolvedValue(null);

    await updateTicket(req, res);

    expect(Ticket.findById).toHaveBeenCalledWith('ticket123');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Ticket not found',
    });
  });

  it('повертає 400, якщо пробують напряму виставити статус "reserved"', async () => {
    req.body.status = 'reserved';

    const ticket = { status: 'available' };
    Ticket.findById.mockResolvedValue(ticket);

    await updateTicket(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Cannot directly set status to reserved. Use booking process.',
    });
  });

  it('повертає 400, якщо оновлення не відбулось (release повертає false)', async () => {
    req.body.status = 'available';

    const ticket = {
      status: 'sold',
      release: jest.fn(() => false),
    };
    Ticket.findById.mockResolvedValue(ticket);

    await updateTicket(req, res);

    expect(ticket.release).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Cannot change ticket status from sold to available',
    });
  });

  it('успішно оновлює квиток до "available"', async () => {
    req.body.status = 'available';

    const ticket = {
      _id: 'ticket123',
      eventId: 'event123',
      status: 'sold',
      release: jest.fn(() => true),
      save: jest.fn(),
    };

    const event = {
      availableTickets: 0,
      save: jest.fn(),
    };

    Ticket.findById.mockResolvedValue(ticket);
    Event.findById.mockResolvedValue(event);
    Ticket.countDocuments.mockResolvedValue(3);

    await updateTicket(req, res);

    expect(ticket.release).toHaveBeenCalled();
    expect(ticket.save).toHaveBeenCalled();
    expect(event.save).toHaveBeenCalled();
    expect(event.availableTickets).toBe(3);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Ticket updated successfully',
        data: ticket,
      })
    );
  });

  it('успішно оновлює квиток до "sold"', async () => {
    req.body.status = 'sold';

    const ticket = {
      _id: 'ticket123',
      eventId: 'event123',
      status: 'reserved',
      confirmSale: jest.fn(() => true),
      save: jest.fn(),
    };

    const event = {
      availableTickets: 0,
      save: jest.fn(),
    };

    Ticket.findById.mockResolvedValue(ticket);
    Event.findById.mockResolvedValue(event);
    Ticket.countDocuments.mockResolvedValue(2);

    await updateTicket(req, res);

    expect(ticket.confirmSale).toHaveBeenCalled();
    expect(ticket.save).toHaveBeenCalled();
    expect(event.availableTickets).toBe(2);
    expect(event.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('успішно оновлює квиток до "cancelled"', async () => {
    req.body.status = 'cancelled';

    const ticket = {
      _id: 'ticket123',
      eventId: 'event123',
      status: 'reserved',
      save: jest.fn(),
    };

    Ticket.findById.mockResolvedValue(ticket);
    Event.findById.mockResolvedValue(null); // Подія не знайдена

    await updateTicket(req, res);

    expect(ticket.status).toBe('cancelled');
    expect(ticket.bookingId).toBeNull();
    expect(ticket.reservationExpiry).toBeNull();
    expect(ticket.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Ticket updated successfully',
        data: ticket,
      })
    );
  });
});
