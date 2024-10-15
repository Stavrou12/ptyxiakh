package mainClasses;

public class Beach {
    private String name;
    private double lat;
    private double lon;
    private double cleanliness;
   private String description;
    private double distance;
    private String StationCode;
    private String Tar;
    
    private String Glass;
    
    private String Plastic;
    private String Caoutchouc;
    private String Garbage;
    private String Intenterococci;
    private String Ecoli;
    
    public Beach(String stationcode,String ecoli, String inter,String name,double lat,double lon,double cleanlinessScore,double distance,String tarVal,String glassVal,
            String plasticVal,String caoutchoucVal,String garbageVal){
        this.StationCode = stationcode;
        this.Ecoli= ecoli;
        this.Intenterococci=inter;
        this.name = name;
        this.lat = lat;
        this.lon = lon;
        this.cleanliness = cleanlinessScore;
        this.distance = distance;
        this.Caoutchouc = caoutchoucVal;
        this.Glass= glassVal;
        this.Garbage = garbageVal;
        this.Tar= tarVal;
        this.Plastic = plasticVal;
        
    }
     public String getStationCode() {
        return StationCode;
    }

    public void setStationCode(String e) {
        this.StationCode = e;
    }
    public String getEcoli() {
        return Ecoli;
    }

    public void setEcoli(String e) {
        this.Ecoli = e;
    }
    
    public String getIntenterococci() {
        return Intenterococci;
    }

    public void setIntenterococci(String i) {
        this.Intenterococci = i;
    }
    
    
    public String getTar() {
        return Tar;
    }

    public void setTar(String Tar) {
        this.Tar = Tar;
    }

    public String getGlass() {
        return Glass;
    }

    public void setGlass(String Glass) {
        this.Glass = Glass;
    }

    public String getPlastic() {
        return Plastic;
    }

    public void setPlastic(String Plastic) {
        this.Plastic = Plastic;
    }

    public String getCaoutchouc() {
        return Caoutchouc;
    }

    public void setCaoutchouc(String Caoutchouc) {
        this.Caoutchouc = Caoutchouc;
    }

    public String getGarbage() {
        return Garbage;
    }

    public void setGarbage(String Garbage) {
        this.Garbage = Garbage;
    }
    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }

    public double getLon() { return lon; }
    public void setLon(double lon) { this.lon = lon; }

    public double getCleanliness() { return cleanliness; }
    public void setCleanliness(double cleanliness) { this.cleanliness = cleanliness; }
}
