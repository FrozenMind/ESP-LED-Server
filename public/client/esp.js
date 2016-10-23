function ESP(id, color, mode, debug){
    this.Id = id;
    this.Color = color;
    this.Mode = mode;
    this.Debug = (typeof debug === 'undefined') ? false : debug;
}