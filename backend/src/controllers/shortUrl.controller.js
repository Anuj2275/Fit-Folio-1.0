import { nanoid } from 'nanoid';
import ShortUrl from '../models/shortUrl.model.js';

export const createShortUrl = async (req, res, next) => {
    try {
        const { longUrl } = req.body;
        const userId = req.user.id;
        const shortCode = nanoid(8);  // will give 8 character unique id
        
        const shortUrl = await ShortUrl.create({
            longUrl,
            shortCode,
            user: userId,
        });

        res.status(201).json({
            shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
            originalUrl: shortUrl.longUrl,
            shortCode: shortUrl.shortCode
        });
    } catch (error) {
        next(error);
    }
};

export const redirectToLongUrl = async (req, res, next) => {
    try {
        const { shortCode } = req.params;
        const shortUrl = await ShortUrl.findOne({ shortCode });

        if (!shortUrl) {
            return res.status(404).json({ message: 'URL not found.' });
        }

        shortUrl.visits++;
        await shortUrl.save();

        res.redirect(301, shortUrl.longUrl);
    } catch (error) {
        next(error);
    }
};
