import express from 'express';
import fetch from 'node-fetch';
import ejs from 'ejs';
import cors  from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';



const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

const PORT = 3000;



app.use(express.json());
app.use(cors({ origin: true }));

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Google Places API...
const googleAPIKey = 'AIzaSyCaDSA9uQ9dkbkYmsY1FEDkX9ESKYQV2kA'; 
const placeType = 'hospital';
const latitude = 20.3488963;
const longitude = 85.8157988;
let radius = 4 * 1000;

// const googleUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&key=${googleAPIKey}&type=${placeType}`;


// Homepage

app.get("/", async(req,res)=>{
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&key=${googleAPIKey}&type=${placeType}`);
    const nearbyHospitals = await response.json();

    const places = await Promise.all(
      nearbyHospitals.results.map(async (hospital) => {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${hospital.place_id}&key=${googleAPIKey}`;

        const detailsRes = await fetch(detailsUrl);
        const details = await detailsRes.json();

        const contactInfo = details.result.formatted_phone_number || 'Contact information not available';

        const photoReference = details.result.photos && details.result.photos[0].photo_reference;

        const imageUrl = photoReference
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${googleAPIKey}`
          : '/path/to/placeholder-image.jpg'; 

        return {
          placeName: hospital.name,
          contactInfo: contactInfo,
          imageUrl: imageUrl,
        };
      })
    );
  res.render('Homepage', {places});
} catch (error) {
  console.error('Error fetching place details:', error.message);
  res.status(500).send({
    status: 'error',
    message: 'Error fetching place details',
  });
}
});


// Fetching nearby hospitals and rendering the EJS template...
app.get('/nearbyHospital', async (req, res) => {
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&key=${googleAPIKey}&type=${placeType}`);
    const nearbyHospitals = await response.json();

    const places = await Promise.all(
      nearbyHospitals.results.map(async (hospital) => {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${hospital.place_id}&key=${googleAPIKey}`;

        const detailsRes = await fetch(detailsUrl);
        const details = await detailsRes.json();

        const contactInfo = details.result.formatted_phone_number || 'Contact information not available';

        const photoReference = details.result.photos && details.result.photos[0].photo_reference;

        const imageUrl = photoReference
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${googleAPIKey}`
          : '/path/to/placeholder-image.jpg'; 

        return {
          placeName: hospital.name,
          contactInfo: contactInfo,
          imageUrl: imageUrl,
        };
      })
    );

    res.render('nearbyHospitals', { places });
  } catch (error) {
    console.error('Error fetching place details:', error.message);
    res.status(500).send({
      status: 'error',
      message: 'Error fetching place details',
    });
  }
});

// Rendering Nearby Pharmacy
app.get('/nearbyPharmacy', async (req, res) => {
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&key=${googleAPIKey}&type=pharmacy`);
    const nearbyHospitals = await response.json();

    const places = await Promise.all(
      nearbyHospitals.results.map(async (hospital) => {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${hospital.place_id}&key=${googleAPIKey}`;

        const detailsRes = await fetch(detailsUrl);
        const details = await detailsRes.json();

        const contactInfo = details.result.formatted_phone_number || 'Contact information not available';

        const photoReference = details.result.photos && details.result.photos[0].photo_reference;

        const imageUrl = photoReference
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${googleAPIKey}`
          : '/path/to/placeholder-image.jpg'; 

        return {
          placeName: hospital.name,
          contactInfo: contactInfo,
          imageUrl: imageUrl,
        };
      })
    );

    res.render('nearbyPharmacy', { places });
  } catch (error) {
    console.error('Error fetching place details:', error.message);
    res.status(500).send({
      status: 'error',
      message: 'Error fetching place details',
    });
  }
});

// Med-Connect
const users = {}; // to handle the users
io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        console.log('New User ', name)
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);

    });
    socket.on('send', message => {
        socket.broadcast.emit('receive', {
            message: message,
            name: users[socket.id]
        })
    });
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', {
            message: message,
            name: users[socket.id]
        });
        delete users[socket.id];
    });
})

app.get('/medConnect', (req,res)=>{
  res.render('medConnect');
})


// Listening on Port
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});