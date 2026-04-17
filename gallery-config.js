(function () {
  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function createCatalog(definitions) {
    var byKey = {};
    definitions.forEach(function (entry) {
      var aliases = [entry.label]
        .concat(entry.aliases || [])
        .concat(entry.key)
        .map(function (value) { return slugify(value); })
        .filter(Boolean);
      byKey[entry.key] = {
        key: entry.key,
        label: entry.label,
        shortLabel: entry.shortLabel || entry.label,
        icon: entry.icon || '',
        aliases: Array.from(new Set(aliases))
      };
    });

    function find(value) {
      var normalized = slugify(value);
      if (!normalized) return null;
      var keys = Object.keys(byKey);
      for (var i = 0; i < keys.length; i++) {
        var item = byKey[keys[i]];
        if (item.aliases.indexOf(normalized) !== -1) return item;
      }
      return null;
    }

    return {
      list: definitions.map(function (entry) { return byKey[entry.key]; }),
      byKey: byKey,
      find: find
    };
  }

  var eventCatalog = createCatalog([
    { key: 'wedding', label: 'Wedding', icon: '💍' },
    { key: 'reception', label: 'Reception', icon: '🎉' },
    { key: 'engagement', label: 'Engagement', icon: '💝' },
    { key: 'sangeet', label: 'Sangeet', icon: '🎶' },
    { key: 'mehendi', label: 'Mehendi', icon: '🌿' },
    { key: 'haldi', label: 'Haldi', icon: '🌼' },
    { key: 'baby-shower', label: 'Baby Shower', icon: '👶' },
    { key: 'birthday', label: 'Birthday', icon: '🎂', aliases: ['Birthday Party'] },
    { key: 'anniversary', label: 'Anniversary', icon: '🌹' },
    { key: 'housewarming', label: 'Housewarming', icon: '🏠' },
    { key: 'corporate', label: 'Corporate', icon: '🏢', aliases: ['Corporate Event', 'Corporate Gala'] },
    { key: 'farewell', label: 'Farewell', icon: '👋' },
    { key: 'naming-ceremony', label: 'Naming Ceremony', shortLabel: 'Naming', icon: '🍼', aliases: ['Naming'] },
    { key: 'cradle-ceremony', label: 'Cradle Ceremony', icon: '🌸' },
    { key: 'logistics', label: 'Logistics', icon: '🚚' },
    { key: 'photography', label: 'Photography', icon: '📷' },
    { key: 'live-music-entertainment', label: 'Live Music and Entertainment', shortLabel: 'Live Music', icon: '🎵', aliases: ['Live Music & Entertainment'] },
    { key: 'premium-lighting-design', label: 'Premium Lighting Design', shortLabel: 'Lighting', icon: '✨', aliases: ['Premium Lighting and Design'] },
    { key: 'general', label: 'General', icon: '📸', aliases: ['General / Other', 'Other'] }
  ]);

  var serviceCatalog = createCatalog([
    { key: 'luxury-decor-styling', label: 'Luxury Decor & Styling', icon: '🌸' },
    { key: 'professional-photography', label: 'Professional Photography', icon: '📷' },
    { key: 'live-music-entertainment', label: 'Live Music & Entertainment', shortLabel: 'Live Music', icon: '🎵', aliases: ['Live Music and Entertainment'] },
    { key: 'premium-lighting-design', label: 'Premium Lighting Design', shortLabel: 'Lighting', icon: '✨', aliases: ['Premium Lighting and Design'] },
    { key: 'logistics-services', label: 'Logistics Services', shortLabel: 'Logistics', icon: '🚚' },
    { key: 'gourmet-catering', label: 'Gourmet Catering', shortLabel: 'Catering', icon: '🍽️' },
    { key: 'complete-event-management', label: 'Complete Event Management', shortLabel: 'Event Mgmt', icon: '🎊' }
  ]);

  var galleryFilters = [
    { key: 'all', label: 'All', icon: '🎊', type: 'all' },
    { key: 'wedding', label: 'Wedding', icon: '💍', type: 'event' },
    { key: 'reception', label: 'Reception', icon: '🎉', type: 'event' },
    { key: 'engagement', label: 'Engagement', icon: '💝', type: 'event' },
    { key: 'sangeet', label: 'Sangeet', icon: '🎶', type: 'event' },
    { key: 'mehendi', label: 'Mehendi', icon: '🌿', type: 'event' },
    { key: 'haldi', label: 'Haldi', icon: '🌼', type: 'event' },
    { key: 'baby-shower', label: 'Baby Shower', icon: '👶', type: 'event' },
    { key: 'birthday', label: 'Birthday', icon: '🎂', type: 'event' },
    { key: 'anniversary', label: 'Anniversary', icon: '🌹', type: 'event' },
    { key: 'housewarming', label: 'Housewarming', icon: '🏠', type: 'event' },
    { key: 'corporate', label: 'Corporate', icon: '🏢', type: 'event' },
    { key: 'farewell', label: 'Farewell', icon: '👋', type: 'event' },
    { key: 'naming-ceremony', label: 'Naming', icon: '🍼', type: 'event' },
    { key: 'cradle-ceremony', label: 'Cradle Ceremony', icon: '🌸', type: 'event' },
    { key: 'logistics', label: 'Logistics', icon: '🚚', type: 'event' },
    { key: 'photography', label: 'Photography', icon: '📷', type: 'event' },
    { key: 'live-music-entertainment', label: 'Live Music and Entertainment', icon: '🎵', type: 'service' },
    { key: 'premium-lighting-design', label: 'Premium Lighting Design', icon: '✨', type: 'service' }
  ];

  function normalizeEventCategory(value) {
    var match = eventCatalog.find(value);
    if (match) return match.label;
    return value ? String(value).trim() : 'General';
  }

  function normalizeService(value) {
    var match = serviceCatalog.find(value);
    if (match) return match.label;
    return value ? String(value).trim() : '';
  }

  function getEventCategoryKey(value) {
    var match = eventCatalog.find(value);
    return match ? match.key : slugify(value || 'general') || 'general';
  }

  function getServiceKey(value) {
    var match = serviceCatalog.find(value);
    return match ? match.key : slugify(value || '');
  }

  function normalizeGalleryItem(item) {
    var normalizedService = normalizeService(item && item.service);
    var normalizedCategory = normalizeEventCategory(item && item.eventCategory);
    var serviceKey = getServiceKey(normalizedService);
    var eventCategoryKey = getEventCategoryKey(normalizedCategory);
    var filterKeys = Array.from(new Set([eventCategoryKey, serviceKey].filter(Boolean)));
    return Object.assign({}, item, {
      service: normalizedService,
      serviceKey: serviceKey,
      eventCategory: normalizedCategory,
      eventCategoryKey: eventCategoryKey,
      filterKeys: filterKeys
    });
  }

  function needsGalleryNormalization(item) {
    if (!item) return false;
    var normalized = normalizeGalleryItem(item);
    var currentKeys = Array.isArray(item.filterKeys) ? item.filterKeys.slice().sort().join('|') : '';
    var normalizedKeys = normalized.filterKeys.slice().sort().join('|');
    return item.service !== normalized.service ||
      item.eventCategory !== normalized.eventCategory ||
      item.serviceKey !== normalized.serviceKey ||
      item.eventCategoryKey !== normalized.eventCategoryKey ||
      currentKeys !== normalizedKeys;
  }

  function matchesGalleryFilter(item, filterKey) {
    if (!filterKey || filterKey === 'all') return true;
    var normalized = normalizeGalleryItem(item);
    return normalized.filterKeys.indexOf(filterKey) !== -1;
  }

  window.HHGalleryTaxonomy = {
    slugify: slugify,
    eventCategories: eventCatalog.list,
    services: serviceCatalog.list,
    galleryFilters: galleryFilters,
    normalizeEventCategory: normalizeEventCategory,
    normalizeService: normalizeService,
    getEventCategoryKey: getEventCategoryKey,
    getServiceKey: getServiceKey,
    normalizeGalleryItem: normalizeGalleryItem,
    needsGalleryNormalization: needsGalleryNormalization,
    matchesGalleryFilter: matchesGalleryFilter
  };
})();
