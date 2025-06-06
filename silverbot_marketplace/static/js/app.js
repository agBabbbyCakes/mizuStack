document.addEventListener('alpine:init', () => {
    Alpine.data('setupForm', () => ({
        currentPhase: 1,
        selectedBot: null,
        formData: {
            tenderlyToken: '',
            tenderlyAccount: '',
            tenderlyProject: '',
            coingeckoKey: '',
            geminiKey: ''
        },
        errors: {},
        isLoading: false,
        successMessage: '',
        showConfetti: false,
        ownedBots: [],
        customizationOptions: {
            color: '#3b82f6',
            accessories: [],
            performance: {
                power: 0,
                defense: 0,
                speed: 0,
                intelligence: 0
            }
        },

        bots: [
            {
                id: 'SBX-001',
                name: 'Silverbot X',
                type: 'security',
                role: 'Security Protocol',
                edition: 'Elite',
                image: 'assets/imgs/bot1.png',
                description: 'A vigilant security bot with advanced scanning capabilities.',
                lore: 'Forged in the depths of the Quantum Core, Silverbot X emerged from a fusion of ancient security protocols and cutting-edge AI. Its creators, the legendary CryptoSentinel Guild, designed it to be the ultimate guardian of digital realms.',
                basePrice: 999,
                stats: {
                    power: 85,
                    defense: 70,
                    speed: 65,
                    intelligence: 90
                },
                availableColors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
                accessories: [
                    { id: 'shield', name: 'Quantum Shield', price: 199, icon: '🛡️' },
                    { id: 'scanner', name: 'Neural Scanner', price: 299, icon: '🔍' },
                    { id: 'core', name: 'AI Core Upgrade', price: 499, icon: '🧠' }
                ]
            },
            {
                id: 'GG-002',
                name: 'GorillaGuard',
                type: 'guard',
                role: 'Defense System',
                edition: 'Premium',
                image: 'assets/imgs/bot2.png',
                description: 'A powerful defensive bot with impenetrable shields.',
                lore: 'Born from the ashes of the Great Firewall Wars, GorillaGuard was created by the mysterious ShieldSmith Collective. Its impenetrable defense systems are said to be powered by fragments of the legendary Titanium Core.',
                basePrice: 799,
                stats: {
                    power: 90,
                    defense: 95,
                    speed: 50,
                    intelligence: 75
                },
                availableColors: ['#4a90e2', '#e24a4a', '#4ae24a', '#e2e24a'],
                accessories: [
                    { id: 'armor', name: 'Titanium Armor', price: 299, icon: '🛡️' },
                    { id: 'shield', name: 'Energy Shield', price: 199, icon: '⚡' },
                    { id: 'core', name: 'Defense Core', price: 399, icon: '🛡️' }
                ]
            },
            {
                id: 'AB-003',
                name: 'Atlas Bot',
                type: 'assistant',
                role: 'AI Assistant',
                edition: 'Standard',
                image: 'assets/imgs/bot3.png',
                description: 'An intelligent assistant bot with advanced problem-solving abilities.',
                lore: 'The first of its kind, Atlas Bot was created by the enigmatic AI Architect Guild. Its neural networks were trained on the ancient Scrolls of Knowledge, giving it unprecedented problem-solving capabilities.',
                basePrice: 599,
                stats: {
                    power: 60,
                    defense: 65,
                    speed: 80,
                    intelligence: 95
                },
                availableColors: ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'],
                accessories: [
                    { id: 'brain', name: 'Neural Upgrade', price: 399, icon: '🧠' },
                    { id: 'memory', name: 'Memory Expansion', price: 299, icon: '💾' },
                    { id: 'core', name: 'Learning Core', price: 499, icon: '📚' }
                ]
            }
        ],

        selectBot(bot) {
            this.selectedBot = bot;
            this.customizationOptions.color = bot.availableColors[0];
            this.customizationOptions.accessories = [];
            this.customizationOptions.performance = { ...bot.stats };
        },

        nextPhase() {
            if (this.currentPhase === 1 && !this.selectedBot) return;
            this.currentPhase++;
        },

        prevPhase() {
            this.currentPhase--;
        },

        toggleAccessory(accessory) {
            const index = this.customizationOptions.accessories.findIndex(a => a.id === accessory.id);
            if (index === -1) {
                this.customizationOptions.accessories.push(accessory);
            } else {
                this.customizationOptions.accessories.splice(index, 1);
            }
        },

        updatePerformance(stat, value) {
            this.customizationOptions.performance[stat] = Math.max(0, Math.min(100, value));
        },

        calculateTotal() {
            if (!this.selectedBot) return 0;
            const accessoriesTotal = this.customizationOptions.accessories.reduce((sum, acc) => sum + acc.price, 0);
            const performanceUpgrade = Object.values(this.customizationOptions.performance)
                .reduce((sum, stat) => sum + (stat - this.selectedBot.stats[Object.keys(this.selectedBot.stats)[0]]), 0) * 10;
            return this.selectedBot.basePrice + accessoriesTotal + performanceUpgrade;
        },

        async handleSubmit() {
            if (!this.validateForm()) {
                return;
            }

            this.isLoading = true;
            this.successMessage = '';
            this.errors = {};

            try {
                const response = await fetch('/setup-agent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...this.formData,
                        bot: {
                            ...this.selectedBot,
                            customization: this.customizationOptions
                        }
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    this.currentPhase = 3;
                    this.showConfetti = true;
                    this.successMessage = 'Your custom bot is ready!';
                    this.ownedBots.push({
                        ...this.selectedBot,
                        customization: this.customizationOptions,
                        purchaseDate: new Date().toISOString()
                    });
                } else {
                    throw new Error(data.message || 'Something went wrong');
                }
            } catch (error) {
                this.errors.submit = error.message;
            } finally {
                this.isLoading = false;
            }
        },

        validateForm() {
            this.errors = {};
            const requiredFields = ['tenderlyToken', 'tenderlyAccount', 'tenderlyProject', 'coingeckoKey'];
            requiredFields.forEach(field => {
                if (!this.formData[field]) {
                    this.errors[field] = 'This field is required';
                }
            });
            return Object.keys(this.errors).length === 0;
        },

        getModuleStatus(field) {
            return this.formData[field] ? '✅ Connected' : '⏳ Pending';
        },

        getProgressWidth() {
            return `${(this.currentPhase / 3) * 100}%`;
        },

        getStatClass(stat) {
            if (stat >= 90) return 'high';
            if (stat >= 70) return 'medium';
            return 'low';
        },

        formatPrice(price) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(price);
        }
    }));
}); 