import express from 'express';
import { Organization, OrganizationMember } from '../models/index.js';

const router = express.Router();

// Get all organizations
router.get('/', async (req, res) => {
  try {
    const organizations = await Organization.findAll({
      include: [OrganizationMember]
    });
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new organization
router.post('/', async (req, res) => {
  try {
    const organization = await Organization.create(req.body);
    res.status(201).json(organization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get organization by ID
router.get('/:id', async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id, {
      include: [OrganizationMember]
    });
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.json(organization);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update organization
router.put('/:id', async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    await organization.update(req.body);
    res.json(organization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;