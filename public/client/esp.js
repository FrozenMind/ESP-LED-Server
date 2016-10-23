function ESP(id, color, mode, debug, debugUser){
    this.Id = id;
    this.Color = color;
    this.Mode = mode;
    this.DebugEnabled = (typeof debug === 'undefined') ? false : debug;
    this.DebugUser = debugUser;
}