function ESP(id, color, mode, debug, debugId){
    this.Id = id;
    this.R = color.R;
    this.G = color.G;
    this.B = color.B;
    this.Mode = mode;
    this.DebugEnabled = (typeof debug === 'undefined') ? false : debug;
    this.DebugId = debugId;
}

