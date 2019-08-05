export const createOrderTicketMessage = ({
    TicketId, ClientId, ProgramId, Symbol, Size, Price, Side, Route, OrderType,
}) => ({
    TicketId,
    ClientId,
    ProgramId,
    Symbol,
    Size,
    Price,
    Side,
    Route,
    OrderType,
});
