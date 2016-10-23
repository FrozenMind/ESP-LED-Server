function ESP(id, color, mode, debug, debugId){
    this.Id = id;
    this.Color = color;
    this.Mode = mode;
    this.DebugEnabled = (typeof debug === 'undefined') ? false : debug;
    this.DebugId = debugId;
}