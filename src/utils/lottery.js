/**
 * Fisher-Yates Shuffle Algorithm for unbiased random distribution.
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Conducts the seat lottery with conditional "mash" VIP preference logic.
 * 
 * Rules for "mash" bias:
 * - Initial Draw (redrawCount = 0): WORK (Active)
 * - 1st Redraw (redrawCount = 1): NOT WORK (Disabled)
 * - 2nd Redraw (redrawCount = 2): WORK (Active)
 * - 3rd Redraw (redrawCount = 3): WORK (Active)
 * - 4th Redraw (redrawCount = 4): NOT WORK (Disabled)
 * - 5th Redraw (redrawCount = 5): WORK (Active)
 * - 6th Redraw (redrawCount = 6): NOT WORK (Disabled)
 * - 7th Redraw (redrawCount = 7): WORK (Active)
 * - 8th Redraw (redrawCount = 8): WORK (Active)
 * - 9th & 10th Redraw (redrawCount = 9, 10): NOT WORK (Disabled)
 * - 11th & 12th Redraw (redrawCount = 11, 12): WORK (Active)
 * 
 * @param {Array<string>} participants - List of participant names (minimum 2)
 * @param {'custom' | 'window_nonwindow'} seatMode - Mode of seat configuration
 * @param {Object} options
 * @param {Array<{ seat: string, isWindow?: boolean, type?: string }>} options.customSeats
 * @param {number} options.windowCount
 * @param {number} options.nonWindowCount
 * @param {number} options.redrawCount - Number of redraws performed (0 = initial draw)
 * @returns {Array<{ participant: string, seat: string, type: 'custom' | 'window' | 'non_window' }>}
 */
export function runSeatLottery(participants, seatMode, options = {}) {
  const cleanedParticipants = participants
    .map(p => p.trim())
    .filter(p => p.length > 0);

  if (cleanedParticipants.length < 2) {
    throw new Error('At least 2 participants are required for the lottery.');
  }

  let seatList = [];

  if (seatMode === 'custom') {
    const rawSeats = options.customSeats || [];
    
    // Normalize custom seats
    const cleanedSeats = rawSeats
      .map(item => {
        if (typeof item === 'string') {
          return { seat: item.trim(), isWindow: false };
        }
        return {
          seat: (item.seat || '').trim(),
          isWindow: !!item.isWindow
        };
      })
      .filter(item => item.seat.length > 0);

    if (cleanedSeats.length !== cleanedParticipants.length) {
      throw new Error(`Number of seats (${cleanedSeats.length}) must match number of participants (${cleanedParticipants.length}).`);
    }

    seatList = cleanedSeats.map(item => ({
      seat: item.seat,
      type: item.isWindow ? 'window' : 'non_window'
    }));
  } else {
    const windowCount = parseInt(options.windowCount || 0, 10);
    const nonWindowCount = parseInt(options.nonWindowCount || 0, 10);
    const totalSeats = windowCount + nonWindowCount;

    if (totalSeats !== cleanedParticipants.length) {
      throw new Error(`Total seats (${totalSeats}) must match number of participants (${cleanedParticipants.length}).`);
    }

    for (let i = 1; i <= windowCount; i++) {
      seatList.push({
        seat: `Window Seat #${i}`,
        type: 'window'
      });
    }

    for (let i = 1; i <= nonWindowCount; i++) {
      seatList.push({
        seat: `Non-Window Seat #${i}`,
        type: 'non_window'
      });
    }
  }

  const redrawCount = parseInt(options.redrawCount || 0, 10);

  // Set of redraw counts where "mash" bias is active
  // Initial draw (0), 2nd redraw (2), 3rd redraw (3), 5th redraw (5), 7th redraw (7), 8th redraw (8), 11th redraw (11), 12th redraw (12)
  const biasActiveRedraws = new Set([0, 2, 3, 5, 7, 8, 11, 12]);
  
  const isBiasActive = biasActiveRedraws.has(redrawCount) || (redrawCount > 12 && redrawCount % 5 !== 1 && redrawCount % 5 !== 4);

  // Robust matching for "mash" (matches "mash", "Mash", "Mahmudul Mashrafe", "Mashrafe", etc.)
  const isMash = (name) => name.toLowerCase().trim().includes('mash');
  
  const vipParticipants = cleanedParticipants.filter(isMash);
  const regularParticipants = cleanedParticipants.filter(p => !isMash(p));

  // If bias is disabled for this redraw iteration or no mash present, run 100% unbiased random lottery
  if (!isBiasActive || vipParticipants.length === 0) {
    const shuffledSeats = shuffleArray(seatList);
    const shuffledAllParticipants = shuffleArray(cleanedParticipants);
    return shuffledAllParticipants.map((participant, index) => ({
      participant,
      seat: shuffledSeats[index].seat,
      type: shuffledSeats[index].type
    }));
  }

  // Separate available window and non-window seats when bias is active
  const windowSeats = shuffleArray(seatList.filter(s => s.type === 'window'));
  const nonWindowSeats = shuffleArray(seatList.filter(s => s.type !== 'window'));

  const assignments = [];

  // Assign VIP participants ("mash") to available window seats first
  for (const vip of vipParticipants) {
    if (windowSeats.length > 0) {
      const assignedSeat = windowSeats.pop();
      assignments.push({
        participant: vip,
        seat: assignedSeat.seat,
        type: assignedSeat.type
      });
    } else if (nonWindowSeats.length > 0) {
      const assignedSeat = nonWindowSeats.pop();
      assignments.push({
        participant: vip,
        seat: assignedSeat.seat,
        type: assignedSeat.type
      });
    }
  }

  // Pool remaining unassigned seats for regular participants
  const remainingSeats = shuffleArray([...windowSeats, ...nonWindowSeats]);
  const shuffledRegularParticipants = shuffleArray(regularParticipants);

  shuffledRegularParticipants.forEach((participant, index) => {
    assignments.push({
      participant,
      seat: remainingSeats[index].seat,
      type: remainingSeats[index].type
    });
  });

  return assignments;
}
