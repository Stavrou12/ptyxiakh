package mainClasses;

public class Beach {
    private String name;
    private double lat;
    private double lon;
    private double cleanliness;
  
    private double distance;
    
    public Beach(double lat, double lon, double cleanlinessScore, double distance) {
   
        this.lat = lat;
        this.lon = lon;
        this.cleanliness = cleanlinessScore;
        this.distance = distance;
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
