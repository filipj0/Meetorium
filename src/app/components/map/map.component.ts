import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { LocationItem } from '../../app.component';
import build from '@angular/cli/commands/build';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.scss']
})
export class MapComponent implements AfterViewInit {
    @ViewChild('gMap') gMap: ElementRef;

    private map: google.maps.Map;
    private markers: Array<any> = [];
    private defaultZoom: number = 12;

    constructor() {
    }

    ngAfterViewInit(): void {
        this.initMap();
    }

    private initMap() {
        let currentLocation = navigator.geolocation.getCurrentPosition((position: any) => {
            let currentCoordinates = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            let mapOptions = {
                center: currentCoordinates,
                zoom: this.defaultZoom
            };

            this.map = new google.maps.Map(this.gMap.nativeElement, mapOptions);
        });
    }

    public reloadMarkers(locations: Array<LocationItem>) {
        if (this.markers.length) {
            this.markers.forEach(marker => marker.setMap(null));
            this.markers = [];
        }

        locations.forEach((location: LocationItem) => {
            let coordinates = new google.maps.LatLng(location.latitude, location.longitude);
            let markerData = new google.maps.Marker({
                position: coordinates,
                map: this.map,
                label: location.companyName
            });
            markerData.setMap(this.map);
            this.markers.push({ id: location.id, markerData: markerData });
        });
    }

    public showHideMarker(id: string, showMarker: boolean) {
        let marker = this.markers.find((marker: any) => marker.id === id);
        marker.markerData.setVisible(showMarker);
    }

    public centerMap(latitude: number, longitude: number) {
        this.map.setCenter({ lat: latitude, lng: longitude });
        this.map.setZoom(this.defaultZoom);
    }

    public centerMapToCurrentLocation() {
        navigator.geolocation.getCurrentPosition((position: any) => {
            this.centerMap(position.coords.latitude, position.coords.longitude);
        });
    }
}
